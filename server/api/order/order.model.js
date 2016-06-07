'use strict';

import moment from 'moment';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var OrderSchema = new mongoose.Schema({
  number: {type: String, index: true},
  state: String,
  last_ip_address: String,
  user: {
    object:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: String,
    name: String
  },

  order_items:[{type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem'}],
  item_count: {type:Number, default: 0},
  item_total: {type:Number, default: 0.0},
  total: {type:Number, default: 0.0},
  payment_total: {type:Number, default: 0.0},
  shipment_total: {type:Number, default: 0.0},
  shipment_state: String,
  payment_state: String,
  special_instructions: String,
  currency: String,
  confirmation_delivered: Boolean,
  considered_risky: Boolean,

  bill_address:{type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
  ship_address:{type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
  payment:{type:mongoose.Schema.Types.ObjectId, ref: 'Payment'},
  //payment_method:{type:mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod'},
  shipment:{type:mongoose.Schema.Types.ObjectId, ref: 'Shipment'},
  //shipment_method:{type:mongoose.Schema.Types.ObjectId, ref: 'ShipmentMethod'},

  approver: {
    object:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: String,
    name: String
  },
  approved_at: Date,
  completed_at: Date,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

/**
 * Pre-save hook
 */
OrderSchema.pre('save', function(next) {
  if(!this._id){
    this._id = new mongoose.Types.ObjectId();
  }

  if (!validatePresenceOf(this.number)) {
    this.number = genOrderNumber();
  }
  return next();
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

var genOrderNumber = function(date){
  var now = date? moment(date): moment();
  //return `S${10000 * now.getFullYear() + 100 * (now.getMonth()+1) + now.getDate()}-`
  //  + `${10000 * now.getHours() + 100 * now.getMinutes() + now.getSeconds()}-`
  //  + `${1000 + now.getMilliseconds()}`;
  return now.format('YYYYMMDD-HHmmss-1SSS');
};

OrderSchema.methods = {

};

OrderSchema.plugin(mongoosastic);

export default mongoose.model('Order', OrderSchema);
