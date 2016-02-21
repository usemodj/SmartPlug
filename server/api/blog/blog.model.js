'use strict';
import Comment from './comment.model';
import Taggable from './taggable.model';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var CommentSchema = Comment.schema;
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
//var mongoosastic = require('mongoosastic');

var BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  photo_url: String,
  summary: String,
  content: String,
  published: Boolean,
  created_at: {type: Date, default: Date.now, index: true},
  updated_at: {type: Date, default: Date.now()},
  author: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    email: String
  },
  comments: [CommentSchema],
  tags: {type: [String]},
  files: [{
    name: String,
    type: {type: String},
    size: String,
    uri: String
  }]
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

BlogSchema.methods = {
  setTaggable(tags){
    //console.log(`>> setTaggable: ${tags}`);
    this.removeTaggable();
    Taggable.addTags({type: 'Blog', taggable_id: this._id, tags: (tags || this.tags)});
  },
  removeTaggable(type, taggable_id){
    Taggable.removeTaggable(type || 'Blog', taggable_id || this._id);
  }
};

BlogSchema.plugin(mongoosastic);
export default mongoose.model('Blog', BlogSchema);
