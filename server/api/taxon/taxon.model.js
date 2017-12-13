'use strict';

const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
const mongooseTreeAncestors = require('mongoose-tree-ancestors');

// Declare a Model name
const modelName = 'Taxon';

var TaxonSchema = new mongoose.Schema({
  name: {type: String, required: true, es_type: 'keyword'},
  position: {type: Number, default: 0},
  permalink: {type: String, es_type: 'keyword'},
  taxonomy: {type: mongoose.Schema.Types.ObjectId, ref: 'Taxonomy'},
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Taxon'},
  // Not required, but it's useful to keep awareness of this field
  ancestors: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Taxon'
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

TaxonSchema.plugin(mongoosastic);
// Add the mongooseTreeAncestors Plugin to the schema
mongooseTreeAncestors(TaxonSchema, {
    // Set the parent field name and model reference
    parentFieldName: 'parent',
    parentFieldRefModel: modelName,

    // Set the ancestors field name and model reference
    ancestorsFieldName: 'ancestors',
    ancestorsFieldRefModel: modelName
});

export default mongoose.model(modelName, TaxonSchema);
