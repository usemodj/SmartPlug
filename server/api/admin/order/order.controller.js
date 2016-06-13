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
import hogan from 'hogan.js';
import fs from 'fs';
import path from 'path';
import config from '../../../config/environment';

import Order from '../../order/order.model';
import StateChange from '../../stateChange/stateChange.model';
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

// callback(err, message)
function sendOrderShippedMail(req, order, callback){
  var filename = path.join(__dirname, './order.shippedMail.hogan.html');
  var transport = req.transport;
  //console.log(filename)
  return Order.findById(order._id).populate('order_items')
    .execAsync()
    .then(updatedOrder => {
      //console.log(updatedOrder)
      fs.readFile(filename, function(err, contents){
        if(err) return callback(err);
        //console.log(contents);
        var template = hogan.compile(contents.toString());
        //order.subTotal = function(price, qty){ return price * qty};
        var html = template.render({order: updatedOrder, siteUrl: config.domain});

        var message = {};
        message.from = config.postmailer;
        message.to = order.user.email;
        message.subject = 'Order Shipped Mail';
        message.html = html;
        //console.log(message);
        transport.sendMail(message, function (err) {
          if (err) {
            console.error(err);
            return callback(err);

          }
          //console.log('Confirm Mail sent successfully!');
          // if you don't want to use this transport object anymore, uncomment following line
          //transport.close(); // close the connection pool
          return callback(null, message);

        });
      });
    });
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
  if(q.state){
    conditions.push({state: q.state});
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
    .populate('bill_address')
    .populate('ship_address')
    .populate({path: 'payment', populate:{path: 'payment_method', model:'PaymentMethod'}})
    .populate({path: 'shipment', populate:{path: 'shipping_method', model:'ShippingMethod'}})
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

export function state(req, res){
  //console.log(req.body);
  var previousState = '';
  Order.findByIdAsync(req.params.id)
  .then(order => {
      previousState = order.state;
      order.state = req.body.state;
      order.approver = {
        object: req.user._id,
          email: req.user.email,
          name: req.user.name
      };
      return order.saveAsync().spread(updated => { return updated});
  })
  .then(updatedOrder => {
      StateChange.createAsync({
        name: 'Order',
        next_state: updatedOrder.state,
        previous_state: previousState,
        order: updatedOrder,
        user: req.user._id,
        updated_at: new Date()
      });

      return updatedOrder;
  })
  .then(respondWithResult(res))
  .catch(handleError(res));

}

export function paid(req, res){
  //console.log(req.body);
  Order.findByIdAsync(req.params.id)
    .then(order => {
      order.payment_state = 'Paid';
      order.shipment_state = 'Ready';
      order.approver = {
        object: req.user._id,
        email: req.user.email,
        name: req.user.name
      };
      return order.saveAsync().spread(updated => { return updated});
    })
    .then(updatedOrder => {
      StateChange.createAsync([{
        name: 'Payment',
        next_state: updatedOrder.payment_state,
        previous_state: 'Balance-Due',
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      },{
        name: 'Shipment',
        next_state: updatedOrder.shipment_state,
        previous_state: 'Pending',
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      }]);

      return updatedOrder;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));

}
export function shipped(req, res){
  //console.log(req.body);
  Order.findByIdAsync(req.params.id)
    .then(order => {
      if(order.shipment_state !== 'Ready'){
        return res.status(500).json('Shipment state must be "Ready"!');
      }
      order.ship_info = req.body.ship_info;
      order.shipment_state = 'Shipped';
      order.approver = {
        object: req.user._id,
        email: req.user.email,
        name: req.user.name
      };
      return order.saveAsync().spread(updated => { return updated});
    })
    .then(updatedOrder => {
      StateChange.createAsync({
        name: 'Shipment',
        next_state: updatedOrder.shipment_state,
        previous_state: 'Ready',
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      });

      sendOrderShippedMail(req, updatedOrder, (err, message) => {
        if(err) {
          console.log(err);
        } else {
          console.log('Order Shipped Mail is sent successfully.');
        }
      });

      return updatedOrder;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));

}

export function stateChanges(req, res) {
  console.log(req.query);
  var clientLimit = req.query.clientLimit;
  var query = {order: req.params.id};
  StateChange.countAsync(query)
    .then(count => {
      if(count == 0){
        return [];
      }
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);

      return StateChange.where(query).populate('user').limit(queryParams.limit).skip(queryParams.skip).sort('-updated_at').findAsync()
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}
