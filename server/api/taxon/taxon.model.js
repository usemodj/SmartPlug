'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
var tree = require('mongoose-path-tree');

var TaxonSchema = new mongoose.Schema({
  name: {type: String, required: true},
  position: {type: Number, default: 0},
  permalink: String,
  taxonomy: {type: mongoose.Schema.Types.ObjectId, ref: 'Taxonomy'},
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Taxon'},
  icon_filename: String,
  description: String,
  meta_title: String,
  meta_description: String,
  meta_keywords: String,
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

TaxonSchema.methods = {

};

TaxonSchema.plugin(tree);
TaxonSchema.plugin(mongoosastic);

export default mongoose.model('Taxon', TaxonSchema);
