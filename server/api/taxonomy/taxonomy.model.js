'use strict';

import shortid from 'shortid';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var TaxonomySchema = new mongoose.Schema({
  name: String,
  position: {type: Number, default: 0},
  //taxon: {type: mongoose.Schema.Types.ObjectId, ref: 'Taxon'},
  tree: mongoose.Schema.Types.Mixed,
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});


var validatePresenceOf = function(value) {
  return value && value.length;
};

TaxonomySchema.statics = {
  genShortId(){
    return shortid.generate();
  },
  genObjectId(){
    return new mongoose.Types.ObjectId();
  }
};
TaxonomySchema.methods = {

};

TaxonomySchema.plugin(mongoosastic);

export default mongoose.model('Taxonomy', TaxonomySchema);
