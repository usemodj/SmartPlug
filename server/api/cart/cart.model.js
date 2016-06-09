'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var CartSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  uri: String,
  user: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: String,
    name: String
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
