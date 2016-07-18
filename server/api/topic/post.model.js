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
    ctype: {type: String},
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
