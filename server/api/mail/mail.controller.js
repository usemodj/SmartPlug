/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/mails              ->  index
 * POST    /api/mails              ->  create
 * GET     /api/mails/:id          ->  show
 * PUT     /api/mails/:id          ->  update
 * DELETE  /api/mails/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
//import Mail from './mail.model';

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

/**
 * Send Mail
 * @param req
 * @param res
 * @param next
 */
export function create(req, res, next){
  var transport = req.transport;
  var message = req.body.message;
  transport.sendMail(message)
    .then(() => {
      res.status(200).json('Mail sent successfully.');
    })
    .catch(err => next(err));
}

/*
// Gets a list of Mails
export function index(req, res) {
  Mail.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Mail from the DB
export function show(req, res) {
  Mail.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Mail in the DB
export function create(req, res) {
  Mail.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Mail in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Mail.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Mail from the DB
export function destroy(req, res) {
  Mail.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
*/
