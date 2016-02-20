'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var PostSchema = new mongoose.Schema({
  name: {type: String, required: true},
  content: String,
  root: {type: Boolean, default: false},
  forum: {type: mongoose.Schema.Types.ObjectId, ref: 'Forum', index: true},
  topic: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic', index: true},
  author: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    email: String
  },
  files: [{
    name: String,
    type: {type: String},
    size: String,
    uri: String
  }],
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}

});

PostSchema.plugin(mongoosastic, {
  //populate: [
  //  {path: 'topic'}
  //]
});
export default mongoose.model('Post', PostSchema);
