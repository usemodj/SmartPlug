'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var StateChangeSchema = new mongoose.Schema({
  name: String,
  previous_state: String,
  next_state: String,
  order:{ type: mongoose.Schema.Types.ObjectId, ref:'Order'},
  user:{ type: mongoose.Schema.Types.ObjectId, ref:'User'},

  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

StateChangeSchema.methods = {

};

StateChangeSchema.plugin(mongoosastic);
export default mongoose.model('StateChange', StateChangeSchema);
