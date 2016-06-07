'use strict';
//import OptionType from '../optionType/optionType.model';
//import Taxon from '../taxon/taxon.model';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
//var OptionTypeSchema = OptionType.schema;
//var TaxonSchema = Taxon.schema;

var ProductSchema = new mongoose.Schema({
  sku: String,
  name: String,
  properties: String,
  description: String,
  available_on: {type: Date,index: true},
  deleted_at: {type: Date, index: true},
  meta_description: String,
  meta_keywords: String,
  created_at: {type: Date, default: Date.now(), index: true},
  updated_at: {type: Date, default: Date.now()},
  option_types: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'OptionType'
  }],
  taxons: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Taxon'
  }],
  variants: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Variant'
  }],
  assets: mongoose.Schema.Types.Mixed
});
var validatePresenceOf = function(value) {
  return value && value.length;
};

ProductSchema.methods = {

};

ProductSchema.plugin(mongoosastic);
export default mongoose.model('Product', ProductSchema);
