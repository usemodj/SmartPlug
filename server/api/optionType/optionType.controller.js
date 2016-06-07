/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/optionTypes              ->  index
 * POST    /api/optionTypes              ->  create
 * GET     /api/optionTypes/:id          ->  show
 * PUT     /api/optionTypes/:id          ->  update
 * DELETE  /api/optionTypes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import async from 'async';
import OptionType from './optionType.model';
import OptionValue from './optionValue.model';

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

function changeOptionValues(optionValues, res){
  return function(entity) {
    return OptionValue.removeAsync({option_type: entity._id})
    .then(() => {
        entity.option_values = [];
        var pos = 0;
        async.each(optionValues, (value, callback) => {
          value.option_type = entity;
          value.position = ++pos;
          OptionValue.createAsync(value)
          .then(optionValue => {
              entity.option_values.push(optionValue);
              callback();
            })
          .catch(err => {
              callback(err);
            });
        }, (err) => {
          if(err){
            res.status(500).send(err);

          } else {
            entity.saveAsync()
              .spread(updated => {
                  OptionType.populate(updated, 'option_values', (err, populated) => {
                    res.status(200).json( populated);
                  });
               });
          }
        });
      });
  };
}

function removeOptionTypeAndValues(res) {
  return function(entity) {
    if (entity) {
      return OptionValue.removeAsync({option_type: entity._id})
      .then(() => {
          return entity.removeAsync()
            .then(() => {
              res.status(204).end();
            });
        });
    }
  };
}

// Gets a list of OptionTypes
export function index(req, res) {
  OptionType.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single OptionType from the DB
export function show(req, res) {
  OptionType.where({_id: req.params.id})
    .populate({path: 'option_values', options: {sort: {position:1}}})
    .findAsync().spread(populated => {return populated;})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new OptionType in the DB
export function create(req, res) {
  OptionType.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing OptionType in the DB
export function update(req, res) {
  //console.log(req.body);
  if (req.body._id) {
    delete req.body._id;
  }
  var optionValues = req.body.option_values;
  OptionType.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(changeOptionValues(optionValues, res))
    .catch(handleError(res));
}

// Deletes a OptionType from the DB
export function destroy(req, res) {
  OptionType.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeOptionTypeAndValues(res))
    .catch(handleError(res));
}

export function position(req, res){
  var entry = req.body.entry;
  var ids = [];
  if(entry) ids = entry.split(',');
  if(ids.length === 0) return;
  var pos = 0;
  async.each(ids, (id, callback) => {
    OptionType.findByIdAsync(id)
      .then(optionType => {
        optionType.position = ++pos;
        return optionType.saveAsync();
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
      res.status(200).send('The positions of the optionTypes are updated.');
    }
  });
}

