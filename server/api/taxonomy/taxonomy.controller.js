/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/taxonomys              ->  index
 * POST    /api/taxonomys              ->  create
 * GET     /api/taxonomys/:id          ->  show
 * PUT     /api/taxonomys/:id          ->  update
 * DELETE  /api/taxonomys/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import async from 'async';
import Taxonomy from './taxonomy.model';
import Taxon from '../taxon/taxon.model';

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

function treeToArray(parent, tree, array){
  var node = {_id: tree._id, name: tree.name};
  if(parent) node.parent = parent;
  array.push(node);
  _.forEach(tree.children, (child) => {
    treeToArray(tree._id, child, array);
  });
}

function saveTaxonsTree(taxonsTree) {
  return function(entity) {
    Taxon.removeAsync({taxonomy: entity._id})
    .then((err) => {
        if(err) {
          console.error(err);
        }
        var taxons = [];
        treeToArray(null, taxonsTree, taxons);
        async.eachSeries(taxons, (taxon, callback) => {
          taxon.taxonomy = entity._id;
          //console.log(taxon);
          Taxon.createAsync(taxon)
          .then(created => {
              callback();
            })
          .catch(err => {
              callback(err);
            });
        }, (err) => {
          if(err){
            console.error(err);
          }
          return entity;
        });
      });
  };
}

// Gets a list of Taxonomys
export function index(req, res) {
  Taxonomy.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Taxonomy from the DB
export function show(req, res) {
  Taxonomy.findById(req.params.id)
    .populate('taxon')
    .execAsync()
    .then(taxonomy => {
      Taxon.getChildrenTree({filters: {taxonomy: taxonomy._id}, fields:'_id name taxonomy',recursive:true, allowEmptyChildren:true}, (err, children) => {
        if(err) console.error(err);
        taxonomy.tree = children ? children: [];
        res.status(200).json(taxonomy);
      });
    })
    //.then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Taxonomy in the DB
export function create(req, res) {
  Taxonomy.createAsync(req.body)
    .then(taxonomy => {
      return Taxon.createAsync({name: taxonomy.name, taxonomy: taxonomy._id})
      .then(taxon => {
          return taxonomy;
        })
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Taxonomy in the DB
export function update(req, res) {
  console.log(req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  Taxonomy.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(saveTaxonsTree(req.body.tree[0]))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Taxonomy from the DB
export function destroy(req, res) {
  Taxonomy.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Updates the positions of the existing Taxonomies in the DB
export function position(req, res) {
  var entry = req.body.entry;
  var ids = [];
  if(entry) ids = entry.split(',');
  if(ids.length === 0) return;
  var pos = 0;
  async.each(ids, (id, callback) => {
    Taxonomy.findByIdAsync(id)
    .then(taxonomy => {
        taxonomy.position = ++pos;
        return taxonomy.saveAsync();
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
      res.status(200).send('The positions of the taxonomies are updated.');
    }
  });
}

export function objectId(req, res){
  var id = Taxonomy.genObjectId();
  //console.log(id);
  res.status(200).json({_id: id});
}
