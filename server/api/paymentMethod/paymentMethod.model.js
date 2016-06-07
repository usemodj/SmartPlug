'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var PaymentMethodSchema = new mongoose.Schema({
  name: String,
  display_on: String,
  info: String,
  active: Boolean,
  position: Number,
  auto_capture: Boolean,
  deleted_at: Date,

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
