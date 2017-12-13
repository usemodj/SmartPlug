'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var PaymentMethodSchema = new mongoose.Schema({
  name: {type: String, es_type: 'keyword'},
  display_on: {type: String, es_type: 'keyword'},
  info: {type: String, es_type: 'text'},
  active: {type: Boolean},
  position: {type: Number},
  auto_capture: {type: Boolean},
  deleted_at: {type: Date},

  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

PaymentMethodSchema.methods = {

};

PaymentMethodSchema.plugin(mongoosastic);
export default mongoose.model('PaymentMethod', PaymentMethodSchema);
