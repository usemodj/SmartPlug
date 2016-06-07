/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/addresses              ->  index
 * POST    /api/addresses              ->  create
 * GET     /api/addresses/:id          ->  show
 * PUT     /api/addresses/:id          ->  update
 * DELETE  /api/addresses/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Address from './address.model';

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

// Gets a list of Addresss
export function index(req, res) {
  Address.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Address from the DB
export function show(req, res) {
  Address.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Address in the DB
export function create(req, res) {
  Address.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Address in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Address.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Address from the DB
export function destroy(req, res) {
  Address.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
