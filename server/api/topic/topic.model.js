'use strict';

import Taggable from '../blog/taggable.model';
import Post from './post.model';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));
var PostSchema = Post.schema;

var TopicSchema = new mongoose.Schema({
  name: {type: String, required: true},
  //content: String,
  sticky: {type: Boolean, default: false},
  active: {type: Boolean, default: true},
  locked: {type: Boolean, default: false},
  views: {type: Number, default: 0},
  replies: {type: Number, default: 0},
  forum: {type: mongoose.Schema.Types.ObjectId, ref: 'Forum', index: true},
  tags: {type: [String]},
  last_post: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    name: String
  },
  last_poster: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: String,
    email: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Post'
  }],
  created_at: {type: Date, default: Date.now(), index: true},
  updated_at: {type: Date, default: Date.now()}

});

TopicSchema.methods = {
  setTaggable(tags){
    //console.log(`>> setTaggable: ${tags}`);
    this.removeTaggable();
    Taggable.addTags({type: 'Topic', taggable_id: this._id, tags: (tags || this.tags)});
  },
  removeTaggable(type, taggable_id){
    Taggable.removeTaggable(type || 'Topic', taggable_id || this._id);
  }
};

TopicSchema.plugin(mongoosastic);
var Topic = mongoose.model('Topic', TopicSchema);
Topic.createMapping({
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
    "topic": {
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

export default Topic;
