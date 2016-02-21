/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/admin/forums              ->  index
 * POST    /api/admin/forums              ->  create
 * GET     /api/admin/forums/:id          ->  show
 * PUT     /api/admin/forums/:id          ->  update
 * DELETE  /api/admin/forums/:id          ->  destroy
 */

'use strict';

import path from 'path';
import fs from 'fs';
import mv from 'mv';
import _ from 'lodash';
import async from 'async';
import Forum from '../../forum/forum.model';
import Topic from '../../topic/topic.model';
import Post from '../../topic/post.model';
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

// Gets a list of Forums
export function index(req, res) {
  Forum.where().sort({position:1, created_at:-1}).findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Forum from the DB
export function show(req, res) {
  Forum.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Forum in the DB
export function create(req, res) {
  //console.log(req.body);
  Forum.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Forum in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Forum.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Forum from the DB
export function destroy(req, res) {
  //Forum.findByIdAsync(req.params.id)
  //  .then(handleEntityNotFound(res))
  //  .then(removeEntity(res))
  //  .catch(handleError(res));

  var forumId = req.params.id;
  Topic.find({forum: forumId}).populate('posts').execAsync()
    .then(topics => {
      async.each(topics, (topic, callback) => {
        topic.posts.forEach(post => {
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
        });
        topic.remove();
        callback();
      }, err => {
        //all done
        Forum.findByIdAndRemove(forumId)
          .then(err => {
            return res.status(200).send();
          });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
}

export function updatePositions(req, res, next){
  console.log(req.body);
  var entry = req.body.entry;
  var ids = [];
  if(entry) ids = entry.trim().split(/\s*,\s*/);
  if(ids.length === 0) return next();
  var forums = [];
  var i = 1;
  async.eachSeries(ids, (id, callback) => {
    Forum.findByIdAsync(id)
    .then(forum => {
        forum.position = i++;
        forum.save();
        forums.push(forum);
        callback();
      });
  }, err => {
    res.status(200).json(forums);
  });
}

