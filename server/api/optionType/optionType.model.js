'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var OptionTypeSchema = new mongoose.Schema({
  name: String,
  presentation: String,
  position: {type: Number, default: 0},
  option_values: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'OptionValue'
  }],
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}

});

var validatePresenceOf = function(value) {
  return value && value.length;
};

OptionTypeSchema.methods = {

};

OptionTypeSchema.plugin(mongoosastic);

export default mongoose.model('OptionType', OptionTypeSchema);
