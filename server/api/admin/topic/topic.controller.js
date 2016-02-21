/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/admin/topics              ->  index
 * POST    /api/admin/topics              ->  create
 * GET     /api/admin/topics/:id          ->  show
 * PUT     /api/admin/topics/:id          ->  update
 * DELETE  /api/admin/topics/:id          ->  destroy
 */

'use strict';

import path from 'path';
import fs from 'fs';
import mv from 'mv';
import _ from 'lodash';
import async from 'async';
import paginate from 'node-paginate-anything';
import Forum from '../../forum/forum.model';
import Topic from '../../topic/topic.model';
import Post from '../../topic/post.model';
import Taggable from '../../blog/taggable.model';
import config from '../../../config/environment';

var uploadPath = config.uploadPath;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
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
  var q = {};
  if(forumId) q.forum = forumId;
  Topic.countAsync(q)
    .then(count => {
      if (count == 0) {
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
          return res.status(200).json({forum: forum, topics: topics});
        });
    })
    .catch(handleError(res));
}

// Gets a single Topic from the DB
export function show(req, res) {
  //Topic.findByIdAsync(req.params.id)
  //  .then(handleEntityNotFound(res))
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
  Topic.where({_id: req.params.id}).populate({path:'posts', options:{sort:{created_at:1}}}).findAsync()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Topic in the DB
export function create(req, res) {
  Topic.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
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
        post.remove();
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
              type: file.type,
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
              type: file.type,
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
              var tags = (!qPost.tags)? []: (typeof qPost.tags == 'string')? qPost.tags.trim().split(/\s*,\s*/): qPost.tags;

              Topic.findByIdAndUpdate(post.topic, {
                name: post.name,
                active: qPost.active,
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
