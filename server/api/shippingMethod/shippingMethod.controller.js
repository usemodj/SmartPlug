/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/shippingMethods              ->  index
 * POST    /api/shippingMethods              ->  create
 * GET     /api/shippingMethods/:id          ->  show
 * PUT     /api/shippingMethods/:id          ->  update
 * DELETE  /api/shippingMethods/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import async from 'async';
import ShippingMethod from './shippingMethod.model';

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

// Gets a list of ShippingMethods
export function index(req, res) {
  ShippingMethod.findAsync(req.query)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ShippingMethod from the DB
export function show(req, res) {
  ShippingMethod.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ShippingMethod in the DB
export function create(req, res) {
  ShippingMethod.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ShippingMethod in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ShippingMethod.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ShippingMethod from the DB
export function destroy(req, res) {
  ShippingMethod.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function position(req, res){
  var entry = req.body.entry;
  var ids = [];
  if(entry) ids = entry.split(',');
  if(ids.length === 0) return;
  var pos = 0;
  async.each(ids, (id, callback) => {
    ShippingMethod.findByIdAndUpdateAsync(id,{
        position: ++pos
      })
      .then(entity => {
        callback();
      })
      .catch(err => {
        callback(err);
      })
  }, (err) => {
    if(err){
      res.status(500).send(err);
    } else {
      res.status(200).send('The positions of the shippingMethods are updated.');
    }
  });
}

