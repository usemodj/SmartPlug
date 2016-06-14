'use strict';

import moment from 'moment';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var ShipmentSchema = new mongoose.Schema({
  order:{type: mongoose.Schema.Types.ObjectId, ref:'Order'},
  shipping_method:{type:mongoose.Schema.Types.ObjectId, ref: 'ShippingMethod'},
  address:{type:mongoose.Schema.Types.ObjectId, ref: 'Address'},
  tracking: String,
  number: {type: String, index: true},
  cost: {type: Number, default: 0.0},
  shipped_at: Date,
  state: String,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

var genShippingNumber = function(date){
  var now = date? moment(date): moment();
  //return `S${10000 * now.getFullYear() + 100 * (now.getMonth()+1) + now.getDate()}-`
  //  + `${10000 * now.getHours() + 100 * now.getMinutes() + now.getSeconds()}-`
  //  + `${1000 + now.getMilliseconds()}`;
  return 'S'+ now.format('YYYYMMDD-HHmmss-1SSS');
};

/**
 * Pre-save hook
 */
ShipmentSchema.pre('save', function(next) {
  //if(!this._id){
  //  this._id = new mongoose.Types.ObjectId();
  //}

  if (!validatePresenceOf(this.number)) {
    this.number = genShippingNumber();
  }
  return next();
});


ShipmentSchema.methods = {

};

ShipmentSchema.plugin(mongoosastic);
export default mongoose.model('Shipment', ShipmentSchema);
