/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/assets              ->  index
 * POST    /api/assets              ->  create
 * GET     /api/assets/:id          ->  show
 * PUT     /api/assets/:id          ->  update
 * DELETE  /api/assets/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import mv from 'mv';
import async from 'async';
import Asset from './asset.model';
import Variant from '../variant/variant.model';
import config from '../../config/environment';

var uploadPath = config.uploadPath;

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
      var pullpath = path.join(uploadPath, entity.uri);
      fs.exists(pullpath, (exists) => {
        if(exists){
          fs.unlink(pullpath);
        }
      });
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

// Gets a list of Assets
export function index(req, res) {
  Asset.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Assets
export function list(req, res) {
  var product_id = req.body.product_id;

  Variant.find({
    product: product_id, deleted_at: null
  })
    .sort({position: 1, _id: 1})
    .populate('product')
    .populate({path: 'option_values', populate: {path: 'option_type', model:'OptionType'}})
    .execAsync()
    .then(variants => {
      //console.log(variants);
      _.forEach(variants, (entity) => {
        var options = [];
        _.forEach(entity.option_values, (value) => {
          options.push(value.option_type.presentation + ':' + value.presentation);
        });
        entity.options = options.join(', ');
      });

      Asset.find({product: product_id})
        .populate({
          path:'variant',
          populate: {path: 'option_values', model:'OptionValue', populate: {path: 'option_type', model:'OptionType'}}
        })
        .execAsync()
        .then(assets => {
          _.forEach(assets, asset => {
            var options = [];
            _.forEach(asset.variant.option_values, (value) => {
              options.push(value.option_type.presentation + ':' + value.presentation);
            });
            asset.variant.options = options.join(', ');
          });
          return res.status(200).json({variants: variants, assets: assets});
        });
    })
    .catch(handleError(res));
}

// Gets a single Asset from the DB
export function show(req, res) {
  Asset.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Asset in the DB
export function create(req, res) {
  console.log(req.body);
  var asset = req.body.asset;
  var files = (req.files.file)? req.files.file: [];

  if(!Array.isArray(files)){
    files = (files)? [files]: [];
  }
  var today = new Date();
  async.each(files, (file, callback) => {
    var uri = path.join('product',''+today.getFullYear(), ''+today.getMonth(),
      ''+today.getDate(), today.getSeconds() + path.basename(file.path));
    var destPath = uploadPath + uri;

    mv( file.path, destPath, {mkdirp: true}, (err) => {
      if(err){
        console.error(err);
      }else {
        var meta = {
          name: file.name,
          type: file.type,
          size: `${file.size}`,
          uri: uri,
          alt: `${asset.alt}`,
          product: `${asset.product}`,
          variant: `${asset.variant}`
        };

        Asset.createAsync(meta)
          .then(asset => {
            callback();
          });
      }
    });
  }, err => {
    //all done
    return res.status(200).send();
  });
}

// Updates an existing Asset in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Asset.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Asset from the DB
export function destroy(req, res) {
  console.log(req.body);
  Asset.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function position(req, res){
  var entry = req.body.entry;
  var ids = [];
  if(entry) ids = entry.split(',');
  if(ids.length === 0) return;
  var pos = 0;
  async.each(ids, (id, callback) => {
    Asset.findByIdAsync(id)
      .then(asset => {
        asset.position = ++pos;
        return asset.saveAsync();
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
      res.status(200).send('The positions of the asset are updated.');
    }
  });
}

