/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/admin/orders              ->  index
 * POST    /api/admin/orders              ->  create
 * GET     /api/admin/orders/:id          ->  show
 * PUT     /api/admin/orders/:id          ->  update
 * DELETE  /api/admin/orders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Order from '../../order/order.model';
import paginate from 'node-paginate-anything';

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

// Gets a list of Orders
export function index(req, res) {
  console.log(req.query);
  var q = JSON.parse(req.query.q);
  var clientLimit = req.query.clientLimit;
  var conditions = [];

  if(q.number){
    conditions.push({number:new RegExp(q.number, 'i')});
  }
  if(q.name){
    conditions.push({name: new RegExp(q.name, 'i')});
  }
  if(q.email){
    conditions.push({'user.email': new RegExp(q.email, 'i')});
  }
  if(q.from){
    var date = new Date(q.from);
    date.setHours(0,0,0,0);
    conditions.push({completed_at: {$gte: date}});
  };
  if(q.to){
    var date = new Date(q.to);
    date.setHours(0,0,0,0);
    conditions.push({completed_at: {$lte: date}});
  };
  if(q.completed){
    conditions.push({completed_at: {$exists: true, $ne: null}});
  }
  if(q.staus){
    conditions.push({status: q.status});
  }


  var query = (conditions.length > 1)? {
    $and: conditions
  }: (conditions.length == 1)? conditions[0]: {};

  Order.countAsync(query)
    .then(count => {
      if(count == 0){
        return [];
      }
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);

      return Order.where(query).populate('order_items').limit(queryParams.limit).skip(queryParams.skip).sort('-number').findAsync()
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Order from the DB
export function show(req, res) {
  Order.findById(req.params.id)
    .populate('order_items')
    .populate('shipment')
    .populate('payment')
    .populate('bill_address')
    .populate('ship_address')
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Order in the DB
export function create(req, res) {
  Order.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Order in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Order.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Order from the DB
export function destroy(req, res) {
  Order.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
