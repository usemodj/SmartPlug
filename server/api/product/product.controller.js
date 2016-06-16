/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';
import Product from './product.model';
import Variant from '../variant/variant.model';
import Asset from '../asset/asset.model';
import paginate from 'node-paginate-anything';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    //todo: debug
    //console.log('>> entity: ');
    //console.log(entity);
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    updated.variant.is_master = true;
    updated.variant.product = updated._id;
    if(entity.option_types){
      updated.option_types = entity.option_types.map(function(item){
        return item._id;
      });
    }
    if(entity.taxons){
      updated.taxons = entity.taxons.map(function(item){
        return item._id;
      });
    }
    if(updated.available_on_submit){
      updated.available_on = updated.available_on_submit;
    } else if(updated.available_on){
      updated.available_on = new Date(updated.available_on + 'T00:00:00');
    }
    if(updated.deleted_at_submit){
      updated.deleted_at = updated.deleted_at_submit;
    } else if(updated.deleted_at){
      updated.deleted_at = new Date(updated.deleted_at + 'T00:00:00');
    }

    //console.log(updated);
    return Variant.findOneAndUpdateAsync({product: updated._id, is_master: true}, updated.variant, {upsert: true, new: true})
    .then(variant => {
        if(updated.variants.indexOf(variant._id) === -1){
          updated.variants.push(variant._id);
        }
        return updated.saveAsync()
          .spread(updated => {
            return updated;
          })
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();// 204 No Content
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

//Public: Gets a list of Products
export function index(req, res) {
  //Product.findAsync()
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
  var clientLimit = req.query.clientLimit;
  var regex = new RegExp(req.query.q, 'i');
  var time = new Date();

  var query = (req.query.q)? {
    $and:[
      {available_on:{$exists: true}},
      {available_on:{$lte: time}},
      {$or: [{deleted_at: null}, {deleted_at: {$gt: time}}]},
      {$or: [{name: regex}, {properties: regex}, {description: regex}]},
    ]} : {
    $and:[
      {available_on:{$exists: true}},
      {available_on:{$lte: time}},
      {$or: [{deleted_at: null}, {deleted_at: {$gt: time}}]}
    ]};
  Product.countAsync(query)
    .then(count => {
      if(count === 0){
        return [];
      }
      //console.log('>>count: ' + count);
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);

      return Product.find(query)
        .populate({path:'variants', match:{is_master: true}})
        .limit(queryParams.limit).skip(queryParams.skip).sort('-created_at')
        .execAsync();
    })
    .then(products => {
      var ids = [];
      products.forEach(product => {
        ids.push( mongoose.Types.ObjectId(product._id));
      });

      console.log(ids);
      return Asset.aggregate([{
        $match:{product:{$in: ids}}
      },{
        $sort:{ position:1, create_at:1 }
      },{
        $group: {
          _id: '$product',
          uri: {$first: '$uri'}
        }
      }])
      .execAsync()
      .then(assets => {
          for(var k=0; k < assets.length; k++) {
            for(var i=0; i < products.length; ++i){
              if(products[i]._id.toString() === assets[k]._id.toString()){
                products[i].assets = assets[k];
                break;
              }
            }
          }
          return products;
        });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Admin: Gets a single Product from the DB
export function show(req, res) {
  Product.find({_id:req.params.id})
    .populate([{
      path:'variants', match:{is_master: true}, options:{sort:{position:1, created_at:1}}
    },{
      path:'option_types', populate:{path: 'option_values', model:'OptionValue'}
    },{
      path:'taxons', options:{sort:{created_at:1}}
    }])
    .execAsync().spread(populated => {return populated;})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Public: Gets a single Public Product from the DB
export function view(req, res) {
  Product.where({_id:req.params.id, $or:[{deleted_at:null},{deleted_at:{$exists:true, $ne:null, $gt: new Date()}}]})
    .populate([{
      path:'variants', match:{is_master: false, active: true}, options:{sort:{position:1, created_at:1}},
      populate:{
        path: 'option_values', model:'OptionValue', populate: {path: 'option_type', model: 'OptionType'}
      }
    }])
    .findAsync().spread(populated => {return populated;})
    .then(handleEntityNotFound(res))
    .then(product => {
      return Asset.find({product: product._id})
      .sort({position:1, created_at:1})
      .execAsync()
      .then(assets => {
          product.assets = assets;
          return product;
        });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Product in the DB
export function create(req, res) {
  //Product.createAsync(req.body)
  //  .then(respondWithResult(res, 201))
  //  .catch(handleError(res));
  var body = req.body;
  //console.log('>> req.body: ', body);
  var product = {
    name: body.name,
    available_on: body.available_on,
    sku: body.sku
  };
  if(body.available_on_submit){
    product.available_on = body.available_on_submit;
  } else if(product.available_on){
    product.available_on = new Date(product.available_on + 'T00:00:00');
    //console.log(product);
  }
  //console.log(product);
  Product.createAsync(product)
    .then(result => {
      product = result;
      var variant = body.variant;
      variant.is_master = true;
      variant.product = product;
      //console.log(variant);
      return Variant.createAsync(variant);
    })
    .then(variant => {
      product.variants.push(variant);
      return product.saveAsync()
        .spread(updated => {
          return updated;
        });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));

}

// Updates an existing Product in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  Product.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Product from the DB
export function destroy(req, res) {
  //Product.findByIdAsync(req.params.id)
  //  .then(handleEntityNotFound(res))
  //  .then(removeEntity(res))
  //  .catch(handleError(res));
  Product.findByIdAndUpdateAsync(req.params.id, {
    deleted_at: new Date()
  }, {new: true})
  .then(entity => {
      res.status(204).end(); // 204 No Content
    });
}

// Admin: index of Products
export function list(req, res){
  //Product.findAsync()
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));
  //console.log(req.query);
  var clientLimit = req.query.clientLimit;
  var q = JSON.parse(req.query.q);
  var now = new Date();
  var conditions = [];
  if(q.name){
    var regex = new RegExp(q.name, 'i');
    conditions.push({$or: [{name: regex}, {properties: regex}, {description: regex}]});
  }
  if(q.sku){
    conditions.push({sku: new RegExp(q.sku, 'i')});
  }
  if(q.deleted){
    conditions.push({deleted_at:{$exists:true, $ne:null, $lte: now}});
  } else {
    conditions.push({$or:[{deleted_at:null},{deleted_at:{$exists:true, $ne:null, $gt: now}}]});
  }

  var query = {};
  if(conditions.length > 1){
    query = {$and: conditions};
  } else {
    query = conditions[0];
  }

  var variantMatch = {is_master:true};

  Product.count(query)
    .populate({path:'variants', match: variantMatch})
    .execAsync()
    .then(count => {
      if(count === 0){
        return [];
      }
      //console.log('>>count: ' + count);
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);

      return Product.find(query)
        .populate({path:'variants', match: variantMatch})
        .limit(queryParams.limit).skip(queryParams.skip).sort('-created_at')
        .execAsync();
    })
    .then(products => {
      var ids = [];
      products.forEach(product => {
        ids.push( mongoose.Types.ObjectId(product._id));
      });

      //console.log(ids);
      return Asset.aggregate([{
        $match:{product:{$in: ids}}
      },{
        $sort:{ position:1, create_at:1 }
      },{
        $group: {
          _id: '$product',
          uri: {$first: '$uri'}
        }
      }])
      .execAsync()
      .then(assets => {
        for(var k=0; k < assets.length; k++) {
          for(var i=0; i < products.length; ++i){
            if(products[i]._id.toString() === assets[k]._id.toString()){
              products[i].assets = assets[k];
              break;
            }
          }
        }
        return products;
      });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Admin: Clone a new Product in the DB
export function clone(req, res) {
  var body = req.body;
  console.log('>> req.body: ', body);

  delete body._id;
  body.variant.is_master = true;
  if(body.option_types){
    body.option_types = body.option_types.map(function(item){
      return item._id;
    });
  }
  if(body.taxons){
    body.taxons = body.taxons.map(function(item){
      return item._id;
    });
  }
  if(body.available_on_submit){
    body.available_on = body.available_on_submit;
  } else if(body.available_on){
    body.available_on = new Date(body.available_on);
    body.available_on.setHours(0,0,0,0);
  }
  if(body.deleted_at_submit){
    body.deleted_at = body.deleted_at_submit;
  } else if(body.deleted_at){
    body.deleted_at = new Date(body.deleted_at);
    body.deleted_at.setHours(0,0,0,0);
  }

  //console.log('>> updated body: ', body);
  var product = null;
  Product.createAsync(body)
    .then(result => {
      product = result;
      var variant = body.variant;
      delete variant._id;
      variant.sku = body.sku;
      variant.is_master = true;
      variant.product = product;
      //console.log(variant);
      return Variant.createAsync(variant);
    })
    .then(variant => {
      product.variants.push(variant);
      return product.saveAsync()
        .spread(updated => {
          return updated;
        });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));

}

