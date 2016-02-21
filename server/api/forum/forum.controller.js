/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/forums              ->  index
 * POST    /api/forums              ->  create
 * GET     /api/forums/:id          ->  show
 * PUT     /api/forums/:id          ->  update
 * DELETE  /api/forums/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import paginate from 'node-paginate-anything';

import Forum from './forum.model';
import Post from '../topic/post.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      //console.log(entity);
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
  //Forum.findAsync()
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
  var clientLimit = req.query.clientLimit;
  var q = {active: true};
  Forum.countAsync(q)
    .then(count => {
      if (count == 0) {
        return [];
      }
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      return Forum.find(q).limit(queryParams.limit).skip(queryParams.skip).sort({position:1, created_at:-1})
        .execAsync();
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function search(req, res, next){
  var clientLimit = req.query.clientLimit;
  var terms = req.params.terms;
  try {
    Post.search({query_string: {query: terms}}, {size: 0, hydrate: false}, (err, results) => {
      if (err) {
        console.error('>>Count Error: ', err);
        return res.status(500).json(err);
      }
      if(results.hits.total == 0){
        return res.status(200).send([]);
      }
      console.log(results.hits)
      var totalItems = results.hits.total;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      //console.log(queryParams);
      Post.search({query_string: {query: terms}}, {
        from: queryParams.skip,
        size: queryParams.limit,
        sort: 'created_at:desc',
        hydrate: true
      }, (err, results) => {
        if(err) {
          console.error('>>error: ', err);
          return res.status(500).json(err);
        }

        //console.log(results.hits.hits)
        res.status(200).json(results.hits.hits);
      });
    });
  } catch(err) {
    console.error(err);
    res.status(500).json(err.message || err);
  }
}

export function recentPosts(req, res, next){
  var clientLimit = req.query.clientLimit;
  console.log(req.query)
  Post.countAsync()
    .then(count => {
      if (count == 0) {
        return [];
      }
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);
      return Post.find().limit(queryParams.limit).skip(queryParams.skip).sort({created_at:-1})
        .execAsync();
    })
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
  Forum.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
