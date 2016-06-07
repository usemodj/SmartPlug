/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/blogs              ->  index
 * POST    /api/blogs              ->  create
 * GET     /api/blogs/:id          ->  show
 * PUT     /api/blogs/:id          ->  update
 * DELETE  /api/blogs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import mv from 'mv';
import async from 'async';
import Blog from './blog.model';
import User from '../user/user.model';
import Taggable from './taggable.model';
import Comment from './comment.model';
import config from '../../config/environment';
import paginate from 'node-paginate-anything';

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
    console.error(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Blogs
export function index(req, res) {
  var clientLimit = req.query.clientLimit;
  Blog.countAsync()
  .then(count => {
    if(count == 0){
      return [];
    }
    var totalItems = count;
    var maxRangeSize = clientLimit;
    var queryParams = paginate(req, res, totalItems, maxRangeSize);

    return Blog.where().limit(queryParams.limit).skip(queryParams.skip).sort('-created_at').findAsync()
  })
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Gets a single Blog from the DB
export function show(req, res) {
  Blog.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Blog in the DB
export function create(req, res) {
  //Blog.createAsync(req.body)
  //  .then(respondWithResult(res, 201))
  //  .catch(handleError(res));

  var user = req.user || JSON.parse(req.cookies.user);
  var body = req.body;
  var blog = body.blog;
  var files = (req.files.file)? req.files.file: [];

  User.findOneAsync({email: user.email})
    .then(user => {
      if(!user){
        return res.status(401).json('Login is required.'); //unauthorized
      }

      var tags = (!blog.tags)? []: (typeof blog.tags == 'string')? blog.tags.trim().split(/\s*,\s*/): blog.tags;

      Blog.createAsync({
          title: blog.title,
          photo_url: blog.photo_url,
          summary: blog.summary,
          content: blog.content,
          published: blog.published,
          tags: tags,
          author: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        })
        .then(blog => {
          //add tags to taggable
          blog.setTaggable();

          if(!Array.isArray(files)){
            files = (files)? [files]: [];
          }
          var today = new Date();
          async.each(files, (file, callback) => {
            var uri = path.join('blog',''+today.getFullYear(), ''+today.getMonth(),
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

                blog.files.push(meta);
              }
              callback();
            });
          }, err => {
            //all done
            blog.save()
              .then(blog => {
                return res.status(200).json(blog);
              });
          });
        })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });

}

export function search(req, res, next){
  var clientLimit = req.query.clientLimit;
  var terms = req.params.terms;
  try {
    Blog.search({query_string: {query: terms}}, {size: 0, hydrate: false}, (err, results) => {
      if (err) {
        console.error(err);
        throw err;
      }
      console.log(results)
      if(results.hits.total == 0){
        return res.status(200).json([]);
      }
      var totalItems = results.hits.total;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      //console.log(queryParams);
      Blog.search({query_string: {query: terms}}, {
        from: queryParams.skip,
        size: queryParams.limit,
        sort: 'created_at:desc',
        hydrate: true
      }, (err, results) => {
        if (err) {
          console.error(err);
          throw err;
        }
        var blogs = [];
        results.hits.hits.forEach((hit) => {
          blogs.push(hit);
        });

        res.status(200).json(blogs);
      });
    });
  } catch(err) {
    console.error(err);
    res.status(500).json(err.message || err);
  }
}

// Updates an existing Blog in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Blog.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Blog from the DB
export function destroy(req, res) {
  Blog.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(entity => {
      if(entity){
        entity.removeTaggable();
        entity.files.forEach(file => {
          var filePath = path.join(uploadPath, file.uri);
          fs.exists(filePath, exists => {
            if(exists){
              fs.unlink(filePath, err => {
                console.error(err);
              });
            }
          });
        });
        return entity;
      }

      return null;
    })
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 *  Multiple file upload
 * @param req
 * @param res
 * @param next
 */
export function updateBlog(req, res, next){
  var user = req.user || JSON.parse(req.cookies.user);
  var body = req.body;
  var blog = body.blog;
  var files = (req.files.file)? req.files.file: [];

  User.findOneAsync({email: user.email})
  .then(user => {
    if(!user){
      return res.status(401).json('Login is required.'); //unauthorized
    }

    var tags = (!blog.tags)? []: (typeof blog.tags == 'string')? blog.tags.trim().split(/\s*,\s*/): blog.tags;

    Blog.findByIdAndUpdateAsync(blog._id, {
      title: blog.title,
      photo_url: blog.photo_url,
      summary: blog.summary,
      content: blog.content,
      published: blog.published,
      tags: tags,
      author: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }, {new: true})
    .then(blog => {
      //add tags to taggable
      blog.setTaggable();

      if(!Array.isArray(files)){
        files = (files)? [files]: [];
      }
      var today = new Date();
      async.each(files, (file, callback) => {
        var uri = path.join('blog',''+today.getFullYear(), ''+today.getMonth(),
          ''+today.getDate(), today.getSeconds() + path.basename(file.path));

        var destPath = uploadPath + uri;

        mv( file.path, destPath, {mkdirp: true}, (err) => {
          if(err){
            console.error(err);
          } else {
            var meta = {
              name: file.name,
              type: file.type,
              size: `${file.size}`,
              uri: uri
            };
            blog.files.push(meta);
          }
          callback();
        });
      }, err => {
         blog.save()
           .then(blog => {
             return res.status(200).json(blog);
           });
      })
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err.message || err);
  });
}

export function removeFile(req, res, next){
  var id = req.params.id;
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

  Blog.findByIdAndUpdateAsync(id, {
    $pull: { files: {uri: uri}}
  })
  .then(blog => {
    res.status(200).json('File is deleted successfully.');
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err.message || err);
  });
}

export function tagBlogs(req, res, next){
  var tag = req.params.tag;
  var clientLimit = req.query.clientLimit;
  Taggable.countAsync({tag: tag, type: 'Blog'})
    .then(count => {
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      console.log(queryParams);
      return Taggable.where({tag: tag, type: 'Blog'})
        .limit(queryParams.limit).skip(queryParams.skip).sort('-created_at').select('taggable_id').findAsync();
  })
  .then(taggables => {
    var ids = [];
    taggables.forEach((taggable) => {
      ids.push(taggable.taggable_id);
    })
    return Blog.findAsync({_id: {$in: ids}})
  })
  .then(blogs => {
    res.status(200).json(blogs);
  })
}

export function addComment(req, res, next){

  var blogId = req.params.id;
  var content = req.body.comment;
  var user = req.user;

  //console.log(req.body);
  if(!user){
    return res.status(401).json('Login is required.'); //unauthorized
  }

  User.findOneAsync({email: user.email})
  .then(user => {
    Blog.findById(blogId, function(err, blog){
      var comment = new Comment({
        content: content,
        author: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
      blog.comments.push(comment);
      return blog.saveAsync();
    })
    .then(blog => {
      return res.status(200).json(blog.comments.pop());
    });

  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err.message || err);
  })
}

export function deleteComment(req, res, next){
  var blogId = req.params.id;
  var commentId = req.params.comment_id;

  Blog.findByIdAndUpdateAsync(blogId, {
      $pull: { comments: {_id: commentId}}
    })
    .then(blog => {
      res.status(200).json('Comment is deleted successfully.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });

}

export function saveComment(req, res, next) {
  var user = req.user || JSON.parse(req.cookies.user);
  var blogId = req.params.id;
  var commentId = req.params.comment_id;
  var content = req.body.content;

  if (!user) {
    return res.status(401).json('Login is required.'); //unauthorized
  }

  User.findOneAsync({email: user.email})
    .then(user => {
      Blog.findByIdAsync(blogId)
      .then(blog => {
        var comment = blog.comments.id(commentId);
        comment.content = content;
        comment.author = {
          _id: user._id,
          name: user.name,
          email: user.email
        };
        return blog.saveAsync();
      })
      .then(blog => {
        res.status(200).json('Comment is updated successfull.');
      })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });
}
