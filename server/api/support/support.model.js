'use strict';
import Comment from '../blog/comment.model';
import Taggable from '../blog/taggable.model';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var CommentSchema = Comment.schema;
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var SupportSchema = new mongoose.Schema({
  subject: { type: String, required: true, index: true },
  content: String,
  status: {type: String, enum: ['Request', 'Feedback', 'Close']},
  created_at: {type: Date, default: Date.now, index: true},
  updated_at: {type: Date, default: Date.now, index: true},
  views: {type: Number, default: 0},
  replies: {type: Number, default: 0},
  last_reply: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
    subject: String,
    created_at: Date
  },
  last_replier: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    email: String
  },
  author: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    email: {type: String, index: true}
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
SupportSchema.methods = {
  setTaggable(tags){
    //console.log(`>> setTaggable: ${tags}`);
    this.removeTaggable();
    Taggable.addTags({type: 'Support', taggable_id: this._id, tags: (tags || this.tags)});
  },
  removeTaggable(type, taggable_id){
    Taggable.removeTaggable(type || 'Blog', taggable_id || this._id);
  }
};

SupportSchema.plugin(mongoosastic);

export default mongoose.model('Support', SupportSchema);
