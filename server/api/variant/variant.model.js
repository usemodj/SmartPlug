'use strict';

import _ from 'lodash';
import OptionValue from '../optionType/optionValue.model';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var VariantSchema = new mongoose.Schema({
  sku: {type: String, es_type: 'keyword'},
  weight: {type: String, es_type: 'keyword'},
  height: {type: String, es_type: 'keyword'},
  width: {type: String, es_type: 'keyword'},
  depth: {type: String, es_type: 'keyword'},
  is_master: {type: Boolean, default: false},
  active: {type: Boolean, default: true},
  price: {type: Number, default: 0.0},
  cost_price: {type: Number, default: 0.0},
  cost_currency: {type: String, es_type: 'keyword'},
  quantity: {type: Number, default: 0},
  position: {type: Number, default: 0},
  options: {type: mongoose.Schema.Types.Mixed},
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  option_values: [{type: mongoose.Schema.Types.ObjectId, ref: 'OptionValue'}]
  //inventory: {type: mongoose.Schema.Types.ObjectId, ref: 'Inventory'}

});

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
VariantSchema.pre('save', function(next) {
  // Handle new/update passwords
  if (!this.isModified('option_values')) {
    return next();
  }

  if (!validatePresenceOf(this.option_values)) {
    return next();
  }

  OptionValue.find({_id:{ $in: this.option_values}})
  .populate('option_type')
  .sort({'option_type.position':1, 'option_type.created_at':1})
  .execAsync()
  .then(entities => {
      var options = [];
      _.forEach(entities, (value) => {
        options.push(value.option_type.presentation + ':' + value.presentation);
      });
      this.options = options.join(', ');
      next();
    })
  .catch(err => {
      console.error(err);
      next(err);
    });
});

VariantSchema.methods = {

};

VariantSchema.plugin(mongoosastic);

export default mongoose.model('Variant', VariantSchema);
