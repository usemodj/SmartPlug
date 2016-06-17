'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var AssetSchema = new mongoose.Schema({
  name: String,
  type: {type: String},
  size: String,
  uri: String,
  alt: String,
  position: Number,
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
  variant: {type: mongoose.Schema.Types.ObjectId, ref: 'Variant'},
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}

});

var validatePresenceOf = function(value) {
  return value && value.length;
};

AssetSchema.methods = {

};

AssetSchema.plugin(mongoosastic);
export default mongoose.model('Asset', AssetSchema);
