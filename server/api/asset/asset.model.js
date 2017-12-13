'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var AssetSchema = new mongoose.Schema({
  name: {type: String, es_type: 'text'},
  type: {type: String, es_type: 'keyword'},
  size: {type: String, es_type: 'keyword'},
  uri: {type: String, es_type: 'keyword'},
  alt: {type: String, es_type: 'text'},
  position: {type: Number},
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
var Asset = mongoose.model('Asset', AssetSchema);

export default Asset;
