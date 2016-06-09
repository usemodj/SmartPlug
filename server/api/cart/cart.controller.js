/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/carts              ->  index
 * POST    /api/carts              ->  create
 * GET     /api/carts/:id          ->  show
 * PUT     /api/carts/:id          ->  update
 * DELETE  /api/carts/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import async from 'async';
import Cart from './cart.model';
import Order from '../order/order.model';
import OrderItem from '../orderItem/orderItem.model';
import StateChange from '../stateChange/stateChange.model';

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

// Gets a list of order items of Cart
export function index(req, res) {

  Cart.find({'user.email': req.user.email})
    .populate('variant')
    .sort({created_at:1})
    .execAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Cart from the DB
export function show(req, res) {
  Cart.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Cart in the DB
export function create(req, res) {
  var cart = req.body;
  cart.user = {
    object: req.user,
    email: req.user.email,
    name: req.user.name
  };
  delete cart._id;

  Cart.countAsync({variant: cart.variant})
  .then(count => {
      if(count == 0) {
        return Cart.createAsync(cart);
      } else {
        return null;
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Cart in the DB
export function update(req, res) {
  //if (req.body._id) {
  //  delete req.body._id;
  //}
  //Cart.findByIdAsync(req.params.id)
  //  .then(handleEntityNotFound(res))
  //  .then(saveUpdates(req.body))
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
  //console.log(req.body);
  var user = req.user;
  var orders = req.body;
  async.each(orders, (order, callback) => {
    Cart.findByIdAndUpdateAsync(order._id, {
        quantity: order.quantity
      })
      .then(() => {
        callback();
      })
      .catch(err => {
        callback(err);
      });
  }, err => {
    if(err){
      console.error(err);
      return res.status(500).json(err);
    } else {
      return res.status(200).json('Update is successed.');
    }
  });
}

// Deletes a Cart from the DB
export function destroy(req, res) {
  Cart.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//Checkout Cart orders
export function checkout(req, res){
  Cart.find({'user.email': req.user.email})
    .populate('variant')
    .sort({created_at:1})
    .execAsync()
    .then(lineItems => {
      var invalid = false;
      _.some(lineItems, item => {
        if(item.quantity > item.variant.quantity){
          invalid = true;
          return true;
        }
      });
      if(invalid){
        return res.status(500).json(lineItems);
      }

      return Order.createAsync({
        state: 'Address',
        last_ip_address: req.connection.remoteAddress,
        user:{
          object: req.user._id,
          email: req.user.email,
          name: req.user.name
        }
      })
      .then(order => {
          var orderItems = [];
          async.each(lineItems, (item, callback) => {
            console.log('>> item.variant: ', item.variant);
            item.variant.quantity -= item.quantity;
            item.variant.saveAsync()
            .then(variant =>{
              return OrderItem.createAsync({
                order: order._id,
                name: item.name,
                quantity: item.quantity,
                uri: item.uri,
                variant:item.variant.toObject(),
                user: {
                  object: req.user._id,
                  email: req.user.email,
                  name: req.user.name
                }
              });
            })
            .then(orderItem => {
                orderItems.push(orderItem);
                callback();
              })
            .catch(err => {
                callback(err);
              });

          }, err => {
            if(err){
              console.error(err);
            }

            order.item_count = orderItems.length;
            order.order_items = orderItems.map( item => {
              return item._id;
            });
            order.item_total = 0;
            _.forEach(orderItems, item => {
              order.item_total += item.quantity * item.variant.price;
            });

            order.saveAsync()
              .spread(updated => {return updated;})
              .then(updated => {
                Cart.removeAsync({'user.email': req.user.email});
                StateChange.findOneAndUpdateAsync({order:updated, previous_state: 'Cart'}, {
                  name: 'Order',
                  next_state: 'Address',
                  previous_state: 'Cart',
                  user: req.user,
                  updated_at: new Date()
                },{new:true, upsert:true});

                return res.status(200).json(updated);
              });

          });
        });

    })
    .catch(handleError(res));

}
