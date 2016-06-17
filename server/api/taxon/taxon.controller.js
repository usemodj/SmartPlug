/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/taxons              ->  index
 * POST    /api/taxons              ->  create
 * GET     /api/taxons/:id          ->  show
 * PUT     /api/taxons/:id          ->  update
 * DELETE  /api/taxons/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';
import Taxon from './taxon.model';
import Product from '../product/product.model';
import Asset from '../asset/asset.model';
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

// Gets a list of Taxons
export function index(req, res) {
  //Taxon.findAsync()
  //  .then(respondWithResult(res))
  //  .catch(handleError(res));

  Taxon.getChildrenTree({fields:'_id name taxonomy',recursive:true, allowEmptyChildren:true}, (err, children) => {
    if(err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.status(200).json(children);
  });
}
// Gets a list of Taxons
export function list(req, res) {
  Taxon.find()
    .sort({taxonomy:1, path:1})
    .execAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));

}

// Gets a single Taxon from the DB
export function show(req, res) {
  Taxon.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Taxon in the DB
export function create(req, res) {
  Taxon.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Taxon in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Taxon.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Taxon from the DB
export function destroy(req, res) {
  Taxon.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function products(req, res){
  console.log(req.query);
  var taxonId = req.params.id;
  var clientLimit = req.query.clientLimit;
  var regex = new RegExp(req.query.q, 'i');
  var time = new Date();

  var query = (req.query.q)? {
    $and:[
      {taxons: taxonId},
      {available_on:{$exists: true}},
      {available_on:{$lte: time}},
      {$or: [{deleted_at: null}, {deleted_at: {$gt: time}}]},
      {$or: [{name: regex}, {properties: regex}, {description: regex}]},
    ]} : {
    $and:[
      {taxons: taxonId},
      {available_on:{$exists: true}},
      {available_on:{$lte: time}},
      {$or: [{deleted_at: null}, {deleted_at: {$gt: time}}]}
    ]};

  Product.countAsync(query)
    .then(count => {
      if(count === 0){
        return [];
      }
      console.log('>>count: ' + count);
      var totalItems = count;
      var maxRangeSize = clientLimit;
      var queryParams = paginate(req, res, totalItems, maxRangeSize);

      return Product.find(query)
        .populate({path:'variants', match:{is_master: true}})
        .limit(queryParams.limit).skip(queryParams.skip).sort('-created_at').execAsync();
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
