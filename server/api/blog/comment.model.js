/**
 * Created by jinny on 16. 2. 2.
 */
// import User from '../user/user.model';
//
// var UserSchema = User.schema;
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var mongoosastic = require('bluebird').promisifyAll(require('mongoosastic'));

var CommentSchema = new mongoose.Schema({
  content: {type: String, es_type: 'text'},
  author: {
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', es_type: 'object'},
    name: {type: String, es_type: 'keyword'},
    email: {type: String, es_type: 'keyword'}
  },
  created_at: {type: Date, default: Date.now },
  updated_at: {type: Date, default: Date.now }
});

CommentSchema.plugin(mongoosastic);
var Comment = mongoose.model('Comment', CommentSchema);
Comment.createMapping({
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
    "comment": {
      "content": { // all fields
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

export default Comment;
