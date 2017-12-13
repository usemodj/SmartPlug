'use strict';

import moment from 'moment';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var OrderSchema = new mongoose.Schema({
  number: {type: String, index: true, es_type: 'keyword'},
  state: {type: String, es_type: 'keyword'},
  last_ip_address: {type: String, es_type: 'keyword'},
  user: {
    object:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, es_type: 'keyword'},
    name: {type: String, es_type: 'keyword'}
  },

  order_items:[{type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem'}],
  item_count: {type:Number, default: 0},
  item_total: {type:Number, default: 0.0},
  total: {type:Number, default: 0.0},
  payment_total: {type:Number, default: 0.0},
  shipment_total: {type:Number, default: 0.0},
  shipment_state: {type: String, es_type: 'keyword'},
  payment_state: {type: String, es_type: 'keyword'},
  ship_info: {type: String, es_type: 'text'},
  special_instructions: {type: String, es_type: 'text'},
  currency: {type: String, es_type: 'keyword'},
  confirmation_delivered: {type: Boolean},
  considered_risky: {type: Boolean},

  bill_address:{type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
  ship_address:{type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
  payment:{type:mongoose.Schema.Types.ObjectId, ref: 'Payment'},
  //payment_method:{type:mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod'},
  shipment:{type:mongoose.Schema.Types.ObjectId, ref: 'Shipment'},
  //shipment_method:{type:mongoose.Schema.Types.ObjectId, ref: 'ShipmentMethod'},

  approver: {
    object:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, es_type: 'keyword'},
    name: {type: String, es_type: 'keyword'}
  },
  approved_at: {type: Date},
  completed_at: {type: Date},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
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


OrderSchema.methods = {

};

OrderSchema.plugin(mongoosastic);

export default mongoose.model('Order', OrderSchema);
