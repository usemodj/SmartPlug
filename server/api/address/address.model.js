'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var AddressSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, es_type: 'keyword'},
  address1: {type: String, es_type: 'text'},
  address2: {type: String, es_type: 'text'},
  zipcode: {type: String, es_type: 'keyword'},
  mobile: {type: String, es_type: 'keyword'},
  phone: {type: String, es_type: 'keyword'},

  active: {type: Boolean},
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
