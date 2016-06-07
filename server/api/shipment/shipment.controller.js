/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/shipments              ->  index
 * POST    /api/shipments              ->  create
 * GET     /api/shipments/:id          ->  show
 * PUT     /api/shipments/:id          ->  update
 * DELETE  /api/shipments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Shipment from './shipment.model';

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

// Gets a list of Shipments
export function index(req, res) {
  Shipment.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Shipment from the DB
export function show(req, res) {
  Shipment.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Shipment in the DB
export function create(req, res) {
  Shipment.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Shipment in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Shipment.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Shipment from the DB
export function destroy(req, res) {
  Shipment.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
