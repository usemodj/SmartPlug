'use strict';
import Comment from './comment.model';
import Taggable from './taggable.model';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var CommentSchema = Comment.schema;
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var BlogSchema = new mongoose.Schema({
  title: { type: String, required: true,es_indexed:true},
  photo_url: String,
  summary: {type:String, es_indexed:true},
  content: {type:String, es_indexed:true},
  published: Boolean,
  created_at: {type: Date, default: Date.now, es_indexed: true},
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
    ctype: {type: String},
    size: String,
    uri: String
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
      "_all": {
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
