'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var AddressSchema = new mongoose.Schema({
  user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: String,
  address1: String,
  address2: String,
  zipcode: String,
  mobile: String,
  phone: String,

  active: Boolean,
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

AddressSchema.methods = {

};

AddressSchema.plugin(mongoosastic);
export default mongoose.model('Address', AddressSchema);
