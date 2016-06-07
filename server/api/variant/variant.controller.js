/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/variants              ->  index
 * POST    /api/variants              ->  create
 * GET     /api/variants/:id          ->  show
 * PUT     /api/variants/:id          ->  update
 * DELETE  /api/variants/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import async from 'async';
import Variant from './variant.model';
import Product from '../product/product.model';

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
    updated.option_values = [];
    for(var prop in updates.options){
      updated.option_values.push(updates.options[prop]);
    }
    console.log('>>updated ...')
    console.log(JSON.stringify(updated));
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

// Gets a list of Variants
export function index(req, res) {
  //Variant.findAsync()
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
  //console.log(req.body);
  var product_id = req.query.product;
  var deleted = req.query.deleted;
  if(deleted == true){
    deleted = {$ne: null};
  } else {
    deleted = null;
  }

  Variant.find({
    product: product_id, is_master: false, deleted_at: deleted
  })
    .sort({position: 1, _id: -1})
    .populate('product')
    .populate({path: 'option_values', populate: {path: 'option_type', model:'OptionType'}})
    .execAsync()
    .then(entities => {
      //console.log(entities);
      //_.forEach(entities, (entity) => {
      //  var options = [];
      //  _.forEach(entity.option_values, (value) => {
      //    options.push(value.option_type.presentation + ':' + value.presentation);
      //  });
      //  entity.options = options.join(', ');
      //});

      return res.status(200).json(entities);
    });
}

// Gets a single Variant from the DB
export function show(req, res) {
  Variant.findById(req.params.id)
    .populate('option_values')
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Variant in the DB
export function create(req, res) {
  var variant = req.body;
  var optionValues = [];
  for(var k in variant.options)
    optionValues.push(variant.options[k]);

  variant.option_values = optionValues;
  //console.log(variant);
  Variant.createAsync(variant)
    .then(variant => {
      return Product.findByIdAsync(variant.product)
      .then(product => {
          product.variants.push(variant);
          product.saveAsync();
          return variant;
        });
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Variant in the DB
export function update(req, res) {
  console.log(req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  Variant.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Variant from the DB
export function destroy(req, res) {
  Variant.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function list(req, res){
  //console.log(req.body);
  var product_id = req.body.product;
  var deleted = req.body.deleted;
  if(deleted == true){
    deleted = {$ne: null};
  } else {
    deleted = null;
  }

  Variant.find({
      product: product_id, is_master: false, deleted_at: deleted
    })
    .sort({position: 1, _id: -1})
    .populate('product')
    .populate({path: 'option_values', populate: {path: 'option_type', model:'OptionType'}})
    .execAsync()
    .then(entities => {
      //console.log(entities);
      //_.forEach(entities, (entity) => {
      //  var options = [];
      //  _.forEach(entity.option_values, (value) => {
      //    options.push(value.option_type.presentation + ':' + value.presentation);
      //  });
      //  entity.options = options.join(', ');
      //});

      return res.status(200).json(entities);
    });
}

export function position(req, res){
  var entry = req.body.entry;
  var ids = [];
  if(entry) ids = entry.split(',');
  if(ids.length === 0) return;
  var pos = 0;
  async.each(ids, (id, callback) => {
    Variant.findByIdAsync(id)
      .then(variant => {
        variant.position = ++pos;
        return variant.saveAsync();
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
      res.status(200).send('The positions of the variants are updated.');
    }
  });
}
