'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var PaymentSchema = new mongoose.Schema({
  order:{type: mongoose.Schema.Types.ObjectId, ref:'Order'},
  payment_method:{type:mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod'},
  amount: {type: Number, default: 0.0},
  uncaptured_amount:{type: Number, default: 0.0},
  state: String,
  card_number: String,
  reply_code: String,
  reply_msg: String,
  tid: String,
  card_auth_code: String,

  //response_code: String,
  //avs_response: String,
  //identifier: String,
  //cvv_response_code: String,
  //cvv_response_message: String,
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

PaymentSchema.methods = {

};

PaymentSchema.plugin(mongoosastic);

export default mongoose.model('Payment', PaymentSchema);
