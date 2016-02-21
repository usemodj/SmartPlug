/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/admin/supports              ->  index
 * POST    /api/admin/supports              ->  create
 * GET     /api/admin/supports/:id          ->  show
 * PUT     /api/admin/supports/:id          ->  update
 * DELETE  /api/admin/supports/:id          ->  destroy
 */

'use strict';

import path from 'path';
import fs from 'fs';
import mv from 'mv';
import _ from 'lodash';
import async from 'async';
import paginate from 'node-paginate-anything';
import Support from '../../support/support.model';
import User from '../../user/user.model';
import Comment from '../../blog/comment.model';
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

// Gets a list of Supports
export function index(req, res) {
  var user = req.user;
  var clientLimit = req.query.clientLimit;
  var subject = req.query.subject;
  var status = req.query.status;
  User.findOneAsync({email: user.email})
    .then(user => {
      var q = {};
      if(subject) q.subject = new RegExp(subject, 'i');
      if(status) q.status = status;
      Support.countAsync(q)
        .then(count => {
          if (count == 0) {
            return [];
          }
          var totalItems = count;
          var maxRangeSize = clientLimit;
          var queryParams = paginate(req, res, totalItems, maxRangeSize);
          return Support.where(q).limit(queryParams.limit).skip(queryParams.skip).sort('-updated_at').findAsync();
        })
        .then(respondWithResult(res))
    })
    .catch(handleError(res));
}

// Gets a single Support from the DB
export function show(req, res) {
  Support.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Support in the DB
export function create(req, res) {
  Support.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Support in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Support.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Support from the DB
//export function destroy(req, res) {
//  Support.findByIdAsync(req.params.id)
//    .then(handleEntityNotFound(res))
//    .then(removeEntity(res))
//    .catch(handleError(res));
//}
// Deletes a Support from the DB
export function destroy(req, res) {
  Support.findByIdAsync(req.params.id)
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

export function search(req, res, next){
  var clientLimit = req.query.clientLimit;
  var terms = req.params.terms;
  try {
    Support.search({query_string: {query: terms}}, {size: 0, hydrate: false}, (err, results) => {
      if (err) {
        console.error(err);
        throw err;
      }
      if(results.hits.total == 0){
        return res.status(200).json([]);
      }
      var totalItems = results.hits.total;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      //console.log(queryParams);
      Support.search({query_string: {query: terms}}, {
        from: queryParams.skip,
        size: queryParams.limit,
        sort: 'updated_at:desc',
        hydrate: true
      }, (err, results) => {
        if (err) {
          console.error(err);
          throw err;
        }
        var supports = [];
        results.hits.hits.forEach((hit) => {
          supports.push(hit);
        });

        res.status(200).json(supports);
      });
    });
  } catch(err) {
    console.error(err);
    res.status(500).json(err.message || err);
  }
}

/**
 *  Multiple file upload
 * @param req
 * @param res
 * @param next
 */
export function updateSupport(req, res, next){
  var user = req.user;
  var support = req.body.support;
  var files = (req.files.file)? req.files.file: [];

  User.findOneAsync({email: user.email})
    .then(user => {
      if(!user){
        return res.status(401).json('Login is required.'); //unauthorized
      }

      var tags = (!support.tags)? []: (typeof support.tags == 'string')? support.tags.trim().split(/\s*,\s*/): support.tags;

      Support.findByIdAndUpdateAsync(support._id, {
        subject: support.subject,
        content: support.content,
        status: support.status,
        tags: tags,
        author: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }, {new: true})
        .then(support => {
          //add tags to taggable
          support.setTaggable();

          if(!Array.isArray(files)){
            files = (files)? [files]: [];
          }
          var today = new Date();
          async.each(files, (file, callback) => {
            var uri = path.join('support',''+today.getFullYear(), ''+today.getMonth(),
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

                support.files.push(meta);
              }
              callback();
            });
          }, (err) => {
            //all done
            support.save()
              .then(support => {
                return res.status(200).json(support);
              });
          });

        })
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

  Support.findByIdAndUpdateAsync(id, {
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

export function tagSupports(req, res, next){
  var tag = req.params.tag;
  var clientLimit = req.query.clientLimit;
  Taggable.countAsync({tag: tag, type: 'Support'})
    .then(count => {
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      //console.log(queryParams);
      return Taggable.where({tag: tag, type: 'Support'})
        .limit(queryParams.limit).skip(queryParams.skip).sort('-created_at').select('taggable_id').findAsync();
    })
    .then(taggables => {
      var ids = [];
      taggables.forEach((taggable) => {
        ids.push(taggable.taggable_id);
      })
      return Support.findAsync({_id: {$in: ids}})
    })
    .then(supports => {
      res.status(200).json(supports);
    })
}

export function addComment(req, res, next){

  var supportId = req.params.id;
  var content = req.body.content;
  var status = req.body.status;
  var user = req.user;

  //console.log(req.body);
  if(!user){
    return res.status(401).json('Login is required.'); //unauthorized
  }

  User.findOneAsync({email: user.email})
    .then(user => {
      Support.findById(supportId, function(err, support){
        var comment = new Comment({
          content: content,
          author: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        });
        support.comments.push(comment);
        var last_reply = {
          _id: comment._id,
          subject: (comment.content)? comment.content.substr(0, 80): '',
          created_at: Date.now()
        };
        var last_replier = {
          _id: user._id,
          name: user.name,
          email: user.email
        };

        support.status = status;
        support.last_reply = last_reply;
        support.last_replier = last_replier;
        support.replies += 1;
        return support.saveAsync();
      })
        .then(support => {
          return res.status(200).json(support.comments.pop());
        });

    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    })
}

export function deleteComment(req, res, next){
  var supportId = req.params.id;
  var commentId = req.params.comment_id;

  Support.findByIdAndUpdateAsync(supportId, {
    $pull: { comments: {_id: commentId}}
  })
    .then(support => {
      support.replies -= 1;
      support.save();
      res.status(200).json('Comment is deleted successfully.');
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });

}

/*
 * Update comment
 */
export function saveComment(req, res, next) {
  var user = req.user;
  var supportId = req.params.id;
  var commentId = req.params.comment_id;
  var content = req.body.content;
  var status = req.body.status;
  if (!user) {
    return res.status(401).json('Login is required.'); //unauthorized
  }

  User.findOneAsync({email: user.email})
    .then(user => {
      Support.findByIdAsync(supportId)
        .then(support => {
          var comment = support.comments.id(commentId);
          comment.content = content;
          comment.updated_at = Date.now();
          comment.author = {
            _id: user._id,
            name: user.name,
            email: user.email
          };
          support.updated_at = Date.now();
          support.status = status;
          return support.saveAsync();
        })
        .then(support => {
          res.status(200).json('Comment is updated successfull.');
        })
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message || err);
    });
}
