'use strict';

import Taggable from '../blog/taggable.model';
//import Forum from '../forum/forum.model';
//import User from '../user/user.model';
import Post from './post.model';

var PostSchema = Post.schema;
//var ForumSchema = Forum.schema;
//var UserSchema = User.schema;
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var TopicSchema = new mongoose.Schema({
  name: {type: String, es_type:'text', required: true},
  //content: String,
  sticky: {type: Boolean, default: false},
  active: {type: Boolean, default: true},
  locked: {type: Boolean, default: false},
  views: {type: Number, default: 0},
  replies: {type: Number, default: 0},
  forum: {type: mongoose.Schema.Types.ObjectId, ref: 'Forum', es_type: 'object'},
  tags: {type: [String], es_type: 'nested'},
  last_post: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', es_type: 'object'},
    name: {type: String, es_type:'text'}
  },
  last_poster: {
    object: {type: mongoose.Schema.Types.ObjectId, ref: 'User', es_type: 'object'},
    name: {type: String, es_type:'keyword'},
    email: {type: String, es_type:'keyword'}
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Post', es_schema: PostSchema,
    es_type: 'object', es_indexed:true, es_select: 'name content'
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
      "name tags": {
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
