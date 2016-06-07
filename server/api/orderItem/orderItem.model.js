'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var OrderItemSchema = new mongoose.Schema({
  order:{type: mongoose.Schema.Types.ObjectId, ref:'Order'},
  name: String,
  quantity: {type: Number, default: 0},
  uri: String,
  variant: mongoose.Schema.Types.Mixed,
  user: {
    object:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: String,
    name: String
  },
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

OrderItemSchema.methods = {

};

OrderItemSchema.plugin(mongoosastic);
export default mongoose.model('OrderItem', OrderItemSchema);
