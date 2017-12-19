'use strict';

const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
const mongooseTree = require('mongoose-data-tree');

// Declare a Model name
const modelName = 'Taxon';

var TaxonSchema = new mongoose.Schema({
  name: {type: String, required: true, es_type: 'keyword'},
  position: {type: Number, default: 0},
  permalink: {type: String, es_type: 'keyword'},
  taxonomy: {type: mongoose.Schema.Types.ObjectId, ref: 'Taxonomy', es_type: 'object'},
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', es_type: 'object'},
  // Not required, but it's useful to keep awareness of this field
  ancestors: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Taxon', es_type: 'object'
  }],
  icon_filename: {type: String, es_type: 'keyword'},
  description: {type: String, es_type: 'text'},
  meta_title: {type: String, es_type: 'text'},
  meta_description: {type: String, es_type: 'text'},
  meta_keywords: {type: String, es_type: 'keyword'},
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

TaxonSchema.methods = {

};


// Add the Plugins to the schema
TaxonSchema.plugin(mongooseTree);
TaxonSchema.plugin(mongoosastic);

export default mongoose.model(modelName, TaxonSchema);
