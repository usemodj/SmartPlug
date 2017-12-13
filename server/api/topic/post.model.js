'use strict';

import User from '../user/user.model';
import Forum from '../forum/forum.model';
//import Topic from './topic.model';

var UserSchema = User.schema;
var ForumSchema = Forum.schema;
//var TopicSchema = Topic.schema;
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var PostSchema = new mongoose.Schema({
  name: {type: String, es_type:'text', required: true},
  content: {type: String, es_type:'text'},
  root: {type: Boolean, default: false},
  forum: {type: mongoose.Schema.Types.ObjectId, ref: 'Forum', index: true,
          es_type: 'object', es_indexed: true},
  topic: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic', index: 'not_analyzed'},
  author: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'User', es_type: 'object'},
    name: {type: String, es_type:'keyword'},
    email: {type: String, es_type:'keyword'}
  },
  files: [{
    name: {type: String, es_type:'keyword'},
    ctype: {type: String, es_type:'keyword'},
    size: {type: String, es_type:'keyword'},
    uri: {type: String, es_type:'keyword'}
  }],
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

PostSchema.plugin(mongoosastic);
var Post = mongoose.model('Post', PostSchema);
Post.createMapping({
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
    "post": {
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

export default Post;
