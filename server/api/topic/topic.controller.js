/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/topics              ->  index
 * POST    /api/topics              ->  create
 * GET     /api/topics/:id          ->  show
 * PUT     /api/topics/:id          ->  update
 * DELETE  /api/topics/:id          ->  destroy
 */

'use strict';

import path from 'path';
import fs from 'fs';
import mv from 'mv';
import _ from 'lodash';
import async from 'async';
import paginate from 'node-paginate-anything';
import Forum from '../forum/forum.model';
import Topic from './topic.model';
import Post from './post.model';
import Taggable from '../blog/taggable.model';
import config from '../../config/environment';

var uploadPath = config.uploadPath;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      //console.log(entity)
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Topics
export function index(req, res) {
  //Topic.findAsync()
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
  var user = req.user;
  var clientLimit = req.query.clientLimit;
  var forumId = req.query.forum_id;
  var q = {'active': true, forum: forumId};
  q.sticky = true;
  Topic.find(q).populate({path: 'posts', match:{root: true}}).sort('-updated_at').execAsync()
  .then(stickyTopics => {
      q.sticky = false;
      Topic.countAsync(q)
        .then(count => {
          if (count === 0) {
            return [];
          }
          var totalItems = count;
          var maxRangeSize = clientLimit;
          var queryParams = paginate(req, res, totalItems, maxRangeSize);

          return Topic.find(q).populate({path: 'posts', match:{root: true}})
            .limit(queryParams.limit).skip(queryParams.skip).sort('-updated_at')
            .execAsync();
        })
        .then(topics => {
          Forum.findById(forumId)
          .then(forum => {
              return res.status(200).json({forum: forum, sticky_topics: (stickyTopics || []), topics: topics});
            });
        });
    })
    .catch(handleError(res));
}

export function tagTopics(req, res, next){
  var tag = req.params.tag;
  var clientLimit = req.query.clientLimit;
  Taggable.countAsync({tag: tag, type: 'Topic'})
    .then(count => {
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      //console.log(queryParams);
      return Taggable.where({tag: tag, type: 'Topic'})
        .limit(queryParams.limit).skip(queryParams.skip).sort('-created_at').select('taggable_id').findAsync();
    })
    .then(taggables => {
      var ids = [];
      taggables.forEach((taggable) => {
        ids.push(taggable.taggable_id);
      });
      return Topic.findAsync({_id: {$in: ids}})
    })
    .then(topics => {
      res.status(200).json({topics: topics});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    })
}

// Gets a single Topic from the DB
export function show(req, res) {
  Topic.where({_id: req.params.id}).populate({path:'posts', options:{sort:{created_at:1}}}).findAsync()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Topic in the DB
export function create(req, res) {
  //Topic.createAsync(req.body)
  //  .then(respondWithResult(res, 201))
  //  .catch(handleError(res));
  var user = req.user;
  var qTopic = req.body.topic;
  var files = (req.files.file)? req.files.file: [];
  if(!user){
    return res.status(401).json('Login is required.'); //unauthorized
  }

  var tags = (!qTopic.tags)? []: (typeof qTopic.tags === 'string')? qTopic.tags.trim().split(/\s*,\s*/): qTopic.tags;
  Topic.createAsync({
    name: qTopic.name,
    forum: qTopic.forum_id,
    locked: qTopic.locked,
    sticky: qTopic.sticky,
    active: true,
    tags: tags
  })
  .then(topic => {
    //add tags to taggable
    topic.setTaggable();

    Post.createAsync({
      name: qTopic.name,
      content: qTopic.content,
      root: true,
      forum: topic.forum,
      topic: topic._id,
      author: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
    .then(post => {
      if (!Array.isArray(files)) {
        files = (files) ? [files] : [];
      }
      var today = new Date();
      async.each(files, (file, callback) => {
        var uri = path.join('topic',''+today.getFullYear(), ''+today.getMonth(),
          ''+today.getDate(), today.getSeconds() + path.basename(file.path));
        var destPath = uploadPath + uri;

        mv(file.path, destPath, {mkdirp: true}, (err) => {
          if (err) {
            console.error(err);
          } else {
            var meta = {
              name: file.name,
              ctype: file.type,
              size: `${file.size}`,
              uri: uri
            };
            post.files.push(meta);
          }
          callback();
        });
      }, err => {
        //all done
        post.save()
        .then(post => {
          Forum.findById(post.forum)
            .then(forum => {
              forum.topic_count++;
              forum.last_topic = {
                object: topic._id,
                name: topic.name,
                updated_at: Date.now()
              };
              forum.save();
            });
          topic.posts.push(post);
          return topic.save();
        })
        .then(topic => {
            console.log(topic)
            return res.status(200).json(topic);
          });
      });
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err.message || err);
  });
}

// Updates an existing Topic in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Topic.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Topic from the DB
export function destroy(req, res) {
  //Topic.findByIdAsync(req.params.id)
  //  .then(handleEntityNotFound(res))
  //  .then(removeEntity(res))
  //  .catch(handleError(res));
  Topic.findById(req.params.id).populate('forum posts').execAsync()
  .then(topic => {
      var postCount = topic.posts.length;
      async.eachSeries(topic.posts, (post, callback) => {
        post.files.forEach(file => {
          var filePath = path.join(uploadPath, file.uri);
          fs.exists(filePath, exists => {
            if(exists){
              fs.unlink(filePath, err => {
                console.error(err);
              });
            }
          });
        });
        callback();
      }, err => {
        //all done
        topic.remove(err => {
          postCount = Math.max(topic.forum.post_count - postCount, 0);
          var topicCount = Math.max(topic.forum.topic_count - 1, 0);
          topic.forum.update({post_count: postCount, topic_count: topicCount}, (err, affected) => {
            return res.status(200).send();
          });
        })
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

}

export function deletePost(req, res, next){
  var postId = req.params.post_id;

  Post.findById(postId).populate('forum topic').execAsync()
  .then(post => {
      post.files.forEach(file => {
        var filePath = path.join(uploadPath, file.uri);
        fs.exists(filePath, exists => {
          if(exists){
            fs.unlink(filePath, err => {
              console.error(err);
            });
          }
        });
      });

      post.remove(err => {
        var replies = Math.max(post.topic.replies - 1, 0);
        post.topic.update({replies: replies, $pull:{posts: post._id}}, (err, affected) => {
          var topicCount = Math.max(post.forum.topic_count - 1, 0);
          var postCount = Math.max(post.forum.post_count - 1, 0);
          post.forum.update({post_count: postCount, topic_count: topicCount}, (err, affected) => {
            return res.status(200).send();
          });
        });
      });
    })
  .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

}

// Creates a new Post in the DB
export function addPost(req, res, next){
  var user = req.user;
  var qPost = req.body.post;
  var files = (req.files.file)? req.files.file: [];

  if(!user){
    return res.status(401).json('Login is required.'); //unauthorized
  }

  Post.createAsync({
      name: qPost.name,
      content: qPost.content,
      forum: qPost.forum_id,
      topic: qPost.topic_id,
      author: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      updated_at: Date.now()
    })
    .then(post => {

      if(!Array.isArray(files)){
        files = (files)? [files]: [];
      }
      var today = new Date();
      async.each(files, (file, callback) => {
        var uri = path.join('post',''+today.getFullYear(), ''+today.getMonth(),
          ''+today.getDate(), today.getSeconds() + path.basename(file.path));

        var destPath = uploadPath + uri;

        mv( file.path, destPath, {mkdirp: true}, (err) => {
          if(err){
            console.error(err);
          }else {
            var meta = {
              name: file.name,
              ctype: file.type,
              size: `${file.size}`,
              uri: uri
            };

            post.files.push(meta);
          }
          callback();
        });
      }, err => {
        //all done
        post.save()
          .then(post => {
            Topic.findByIdAsync(post.topic)
              .then(topic => {
                topic.posts.push(post);
                topic.replies++;
                topic.last_post = {
                  object: post._id,
                  name: post.name
                };
                topic.last_poster = {
                  object: user._id,
                  name: user.name,
                  email: user.email
                };
                topic.save();
                Forum.findByIdAsync(post.forum)
                  .then(forum => {
                    forum.topic_count++;
                    forum.post_count++;
                    forum.last_post = {
                      object: post._id,
                      topic: topic._id,
                      name: post.name,
                      updated_at: Date.now()
                    };
                    return forum.save();
                  })
                  .then(forum => {
                    return res.status(200).json(post);
                  });

              });
          });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });
}

// Updata a Post in the DB
export function updatePost(req, res) {
  //Topic.createAsync(req.body)
  //  .then(respondWithResult(res, 201))
  //  .catch(handleError(res));
  var user = req.user;
  var qPost = req.body.post;
  var files = (req.files.file)? req.files.file: [];

  if(!user){
    return res.status(401).json('Login is required.'); //unauthorized
  }

  Post.findByIdAndUpdateAsync(qPost._id, {
      name: qPost.name,
      content: qPost.content,
      author: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
    .then(post => {

      if(!Array.isArray(files)){
        files = (files)? [files]: [];
      }
      var today = new Date();
      async.each(files, (file, callback) => {
        var uri = path.join('post',''+today.getFullYear(), ''+today.getMonth(),
          ''+today.getDate(), today.getSeconds() + path.basename(file.path));

        var destPath = uploadPath + uri;

        mv( file.path, destPath, {mkdirp: true}, (err) => {
          if(err){
            console.error(err);
          }else {
            var meta = {
              name: file.name,
              ctype: file.type,
              size: `${file.size}`,
              uri: uri
            };

            post.files.push(meta);
          }
          callback();
        });
      }, err => {
        //all done
        post.save()
          .then(post => {
            if(post.root) {
              var tags = (!qPost.tags)? []: (typeof qPost.tags === 'string')? qPost.tags.trim().split(/\s*,\s*/): qPost.tags;

              Topic.findByIdAndUpdate(post.topic, {
                name: post.name,
                sticky: qPost.sticky,
                locked: qPost.locked,
                tags: tags
              },{new:true})
              .then(topic => {
                  //console.log(topic)
                });
            }
            return res.status(200).json(post);
          });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });
}

export function removeFile(req, res, next){
  var id = req.params.post_id;
  var uri = req.body.uri;

  try {
    var destPath = path.join(uploadPath, uri);
    fs.exists(destPath, (exists) => {
      if (exists) {
        fs.unlink(destPath, (err) => {
          console.error(err);
        });
      }
    });
  }catch(err){
    console.error(err);
  }

  Post.findByIdAndUpdateAsync(id, {
    $pull: { files: {uri: uri}}
  })
    .then(support => {
      res.status(200).json('File is deleted successfully.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });
}
