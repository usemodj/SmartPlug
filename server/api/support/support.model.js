'use strict';
import Comment from '../blog/comment.model';
import Taggable from '../blog/taggable.model';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var CommentSchema = Comment.schema;
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var SupportSchema = new mongoose.Schema({
  subject: { type: String, required: true, index: true, es_type: 'text'},
  content: {type: String, es_type: 'text'},
  status: {type: String, enum: ['Request', 'Feedback', 'Close'], es_type: 'keyword'},
  created_at: {type: Date, default: Date.now, index: true},
  updated_at: {type: Date, default: Date.now, index: true},
  views: {type: Number, default: 0},
  replies: {type: Number, default: 0},
  last_reply: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
    subject: {type: String, es_type: 'text'},
    created_at: {type: Date}
  },
  last_replier: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, es_type: 'keyword'},
    email: {type: String, es_type: 'keyword'}
  },
  author: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, es_type: 'keyword'},
    email: {type: String, index: true, es_type: 'keyword'}
  },
  comments: [CommentSchema],
  tags: {type: [String], es_type: ['keyword']},
  files: [{
    name: {type: String, es_type: 'text'},
    type: {type: String, es_type: 'keyword'},
    size: {type: String, es_type: 'keyword'},
    uri: {type: String, es_type: 'keyword'}
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
