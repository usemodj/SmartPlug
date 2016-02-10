/**
 * Created by jinny on 16. 2. 2.
 */
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var CommentSchema = new mongoose.Schema({
  content: String,
  author: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String
  },
  created_at: {type: Date, default: Date.now },
  updated_at: {type: Date, default: Date.now }
});

export default mongoose.model('Comment', CommentSchema);
