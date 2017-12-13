'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var ShippingMethodSchema = new mongoose.Schema({
  name: {type: String, es_type: 'keyword'},
  display_on: {type: String, es_type: 'keyword'},
  amount: {type: Number, default: 0.0},
  position: {type: Number, default: 0},
  active: {type: Boolean},

  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

ShippingMethodSchema.methods = {

};

ShippingMethodSchema.plugin(mongoosastic);
export default mongoose.model('ShippingMethod', ShippingMethodSchema);
