'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
//var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var ForumSchema = new mongoose.Schema({
  name: {type: String, required: true},
  info: String,
  active: Boolean,  // visible to list
  locked: Boolean,  // non-writable
  position: Number,
  topic_count: {type: Number, default: 0},
  post_count: {type: Number, default: 0},
  last_topic: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'},
    name: String,
    updated_at: Date
  },
  last_post: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    topic: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic'},
    name: String,
    updated_at: Date
  },
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}

});

//ForumSchema.plugin(mongoosastic);
export default mongoose.model('Forum', ForumSchema);
