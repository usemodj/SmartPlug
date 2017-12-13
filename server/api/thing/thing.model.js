'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ThingSchema = new mongoose.Schema({
  name: {type: String},
  info: {type: String},
  active: {type: Boolean}
});

export default mongoose.model('Thing', ThingSchema);
