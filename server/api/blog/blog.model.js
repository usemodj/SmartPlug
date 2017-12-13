'use strict';
import Comment from './comment.model';
import Taggable from './taggable.model';
//import User from '../user/user.model';

//var UserSchema = User.schema;
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
var CommentSchema = Comment.schema;

var BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, es_type: 'text', es_indexed:true},
  photo_url: {type: String, es_type: 'keyword'},
  summary: {type:String, es_type: 'text', es_indexed:true},
  content: {type:String, es_type: 'text', es_indexed:true},
  published: {type: Boolean},
  created_at: {type: Date, default: Date.now, es_indexed: true},
  updated_at: {type: Date, default: Date.now()},
  author: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', es_type: 'object'},
    name: {type: String, es_type: 'keyword'},
    email: {type: String, es_type: 'keyword'}
  },
  comments: [CommentSchema],
  tags: {type: [String], es_type: ['keyword']},
  files: [{
    name: {type: String, es_type: 'keyword'},
    ctype: {type: String, es_type: 'keyword'},
    size: {type: String, es_type: 'keyword'},
    uri: {type: String, es_type: 'keyword'}
  }]
});

var validatePresenceOf = function(value) {
  return value && value.length;
};

BlogSchema.methods = {
  setTaggable(tags){
    this.removeTaggable();
    Taggable.addTags({type: 'Blog', taggable_id: this._id, tags: (tags || this.tags)});
  },
  removeTaggable(type, taggable_id){
    Taggable.removeTaggable(type || 'Blog', taggable_id || this._id);
  }
};


BlogSchema.plugin(mongoosastic);
var Blog = mongoose.model('Blog', BlogSchema);
Blog.createMapping({
  "settings": {
    "analysis": {
      "analyzer": {
        "kr_analyzer": {
          "type": "custom",
          "tokenizer": "kr_tokenizer",
          "filter": ["trim", "lowercase","english_stop", "en_snow", "kr_filter"]
        }
      },
      "filter": {
        "en_snow": {
          "type": "snowball",
          "language": "English"
        },
        "english_stop": {
          "type":       "stop",
          "stopwords":  "_english_"
        }
      }
    }
  },
  "mappings": {
    "blog": {
      "title summary content": { // all fields
        "analyzer": "kr_analyzer",
        "search_analyzer": "kr_analyzer"
      }
    }
  }
}, (err, mapping) => {
  if(err){
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  }else {
    console.log('mapping created!');
    console.log(mapping);
  }
});


export default Blog;
