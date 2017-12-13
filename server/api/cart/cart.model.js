'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var CartSchema = new mongoose.Schema({
  name: {type: String, es_type: 'text'},
  quantity: {type: Number},
  uri: {type: String, es_type: 'keyword'},
  user: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, es_type: 'keyword'},
    name: {type: String, es_type: 'keyword'}
  },
  variant: {type: mongoose.Schema.Types.ObjectId, ref:'Variant'},
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});
var validatePresenceOf = function(value) {
  return value && value.length;
};

CartSchema.methods = {

};

CartSchema.plugin(mongoosastic);
export default mongoose.model('Cart', CartSchema);
