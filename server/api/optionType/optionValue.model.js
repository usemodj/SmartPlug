'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var OptionValueSchema = new mongoose.Schema({
  name: String,
  presentation: String,
  position: {type: Number, default: 0},
  option_type: {
    type: mongoose.Schema.Types.ObjectId, ref: 'OptionType'
  },
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}

});
var validatePresenceOf = function(value) {
  return value && value.length;
};

OptionValueSchema.methods = {

};

OptionValueSchema.plugin(mongoosastic);

export default mongoose.model('OptionValue', OptionValueSchema);
