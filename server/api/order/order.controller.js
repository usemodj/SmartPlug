/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  update
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import hogan from 'hogan.js';
import fs from 'fs';
import path from 'path';
import config from '../../config/environment';

import Order from './order.model';
import Address from '../address/address.model';
import Shipment from '../shipment/shipment.model';
import Payment from '../payment/payment.model';
import StateChange from '../stateChange/stateChange.model';
import mongoose from 'mongoose';
import mail from '../mail/mail.service';
import paginate from 'node-paginate-anything';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    console.log(entity);
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
function sendOrderConfirmMail(req, order, callback){
  var filename = path.join(__dirname, './order.confirmMail.hogan.html');
  var transport = req.transport;
  console.log(filename)
  return Order.findById(order._id).populate('order_items')
  .execAsync()
  .then(updatedOrder => {
      console.log(updatedOrder)
      fs.readFile(filename, function(err, contents){
        if(err) return callback(err);
        console.log(contents);
        var template = hogan.compile(contents.toString());
        //order.subTotal = function(price, qty){ return price * qty};
        var html = template.render({order: updatedOrder, siteUrl: config.siteUrl});

        var message = {};
        message.from = config.postmailer;
        message.to = order.user.email;
        message.subject = 'Order Confirmation Mail';
        message.html = html;
        console.log(message);
        transport.sendMail(message, function (err) {
          if (err) {
            console.error(err);
            return callback(err);

          }
          console.log('Confirm Mail sent successfully!');
          //log.debug(message);
          // if you don't want to use this transport object anymore, uncomment following line
          //transport.close(); // close the connection pool
          return callback(null, message);

        });
      });
    });
}
// Gets a list of Orders
export function index(req, res) {
  var clientLimit = req.query.clientLimit;
  var query = {'user.email': req.user.email};
  Order.countAsync(query)
    .then(count => {
      if(count == 0){
        return [];
      }
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);

      return Order.where(query).populate('shipment').limit(queryParams.limit).skip(queryParams.skip).sort('-number').findAsync()
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Order from the DB
export function show(req, res) {
  var query = {_id: req.params.id};
  if(req.user.role !== 'admin'){
    query['user.email'] =  req.user.email;
  }

  Order.findOne(query)
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
  console.log(req.body);
  Order.findByIdAndUpdateAsync(req.params.id, {
    state: req.body.state,
    last_ip_address: req.connection.remoteAddress
  }, {new:true})
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function address(req, res){
  console.log(req.body);
  var order = req.body;
  var billAddress = order.bill_address;
  var shipAddress = order.ship_address;
  billAddress.user = req.user;
  shipAddress.user = req.user;
  var id = billAddress._id || new mongoose.Types.ObjectId();

  Address.findByIdAndUpdateAsync( id, billAddress, {new:true, upsert:true})
  .then(address => {
      order.bill_address = address._id;
      return order;
    })
  .then(order => {
      id = shipAddress._id || new mongoose.Types.ObjectId();
      return Address.findByIdAndUpdateAsync( id, shipAddress, {new:true, upsert:true})
      .then(address => {
          order.ship_address = address._id;
          return order;
        });
    })
  .then(order => {
      return Order.findByIdAndUpdateAsync(req.params.id, {
        state: 'shipping',
        last_ip_address: req.connection.remoteAddress,
        bill_address: order.bill_address,
        ship_address: order.ship_address
      }, {new:true});
    })
    .then(updatedOrder => {
      StateChange.findOneAndUpdateAsync({order:updatedOrder, previous_state: 'address'}, {
        name: 'order',
        next_state: 'shipping',
        previous_state: 'address',
        user: req.user,
        updated_at: new Date()
      },{new:true, upsert:true});

      return updatedOrder;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function shipping(req, res){
  //console.log(req.body);
  var order = req.body;

  Shipment.findOneAndUpdateAsync({order: order._id}, {
    order: order,
    shipping_method: order.shipment.shipping_method,
    address: order.ship_address,
    number: order.shipment.number,
    cost: order.shipment.shipping_method.amount
  }, {new:true, upsert: true})
  .then(shipment => {
      return Order.findByIdAndUpdateAsync(order._id, {
        state: 'payment',
        last_ip_address: req.connection.remoteAddress,
        shipment_total: shipment.cost,
        total: order.item_total + shipment.cost,
        shipment: shipment
      }, {new:true});
    })
    .then(updatedOrder => {
      StateChange.findOneAndUpdateAsync({order: updatedOrder, previous_state: 'shipping'},{
        name: 'order',
        next_state: 'payment',
        previous_state: 'shipping',
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      },{new:true, upsert:true});

      return updatedOrder;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function payment(req, res){
  var order = req.body;

  Payment.findOneAndUpdateAsync({order: order._id}, {
    order: order,
    payment_method: order.payment.payment_method,
    amount: order.total,
    uncaptured_amount: order.total
  }, {new:true, upsert: true})
    .then(payment => {
      return Order.findByIdAndUpdateAsync(order._id, {
        state: 'confirm',
        last_ip_address: req.connection.remoteAddress,
        payment: payment,
        shipment_state: 'pending',
        payment_state: 'balance-due'
      }, {new:true});
    })
    .then(updatedOrder => {
      StateChange.findOneAndUpdateAsync({order: updatedOrder, previous_state: 'payment'},{
        name: 'order',
        previous_state: 'payment',
        next_state: 'confirm',
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      },{new:true, upsert:true});

      StateChange.findOneAndUpdateAsync({order: updatedOrder, name: 'payment', previous_state: null},{
        name: 'payment',
        next_state: 'balance-due',
        previous_state: null,
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      },{new:true, upsert:true});

      StateChange.findOneAndUpdateAsync({order: updatedOrder, name: 'shipment', previous_state: null},{
        name: 'shipment',
        next_state: 'pending',
        previous_state: null,
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      },{new:true, upsert:true});

      return updatedOrder;
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function confirm(req, res){
  console.log(req.body)
  var order = req.body;

  Order.findOneAndUpdateAsync({_id: order._id, 'user.email': req.user.email, completed_at:null}, {
      state: 'complete',
      last_ip_address: req.connection.remoteAddress,
      completed_at: new Date()
    }, {new:true})
    .then(updatedOrder => {
      StateChange.findOneAndUpdateAsync({order: updatedOrder, previous_state: 'confirm'},{
        name: 'order',
        next_state: 'complete',
        previous_state: 'confirm',
        order: updatedOrder,
        user: req.user,
        updated_at: new Date()
      },{new:true, upsert:true});

      return updatedOrder;
    })
    .then(order => {
      sendOrderConfirmMail(req, order, (err, message) => {
        if(err){
          console.log(err);
          order.confirmation_delivered = false;
        } else {
          order.confirmation_delivered = true;
        }

        order.saveAsync()
        .spread(updated => { return updated})
        .then(updated => {
            res.status(200).json(updated);
          })
        .catch(err => {
            res.status(500).json(err);
          })
      });
    })
    .catch(handleError(res));
}

// update creditcard payment
export function updatePayment(req, res){
  var payment = req.body;
  console.log(payment);
  Payment.findOneAsync({order: payment.order._id})
    .then(entity => {
      var updated = _.merge(entity, payment);
      updated.order = entity.order;
      updated.uncaptured_amount = (entity.uncaptured_amount - payment.amount);
      return updated.saveAsync()
      .spread(updated => { return updated;});
    })
    .then(payment => {
      if(payment.reply_code == '0000'){ //payment success

        return Order.findByIdAndUpdateAsync(payment.order, {
          last_ip_address: req.connection.remoteAddress,
          shipment_state: 'ready',
          payment_state: 'paid'
        }, {new:true})
        .then(updatedOrder => {
          StateChange.createAsync({
            name: 'order',
            next_state: 'shipment',
            previous_state: 'paid',
            order: updatedOrder,
            user: req.user,
            updated_at: new Date()
          });

          StateChange.createAsync({
            name: 'payment',
            next_state: 'paid',
            previous_state: 'balance-due',
            order: updatedOrder,
            user: req.user,
            updated_at: new Date()
          });

          StateChange.createAsync({
            name: 'shipment',
            next_state: 'ready',
            previous_state: 'pending',
            order: updatedOrder,
            user: req.user,
            updated_at: new Date()
          });

          return updatedOrder;
        })

      } else { //payment fail
        return Order.findByIdAsync(payment.order);

      }
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}