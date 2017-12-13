/**
 * Created by jinny on 16. 2. 2.
 */
'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TaggableSchema = new mongoose.Schema({
  tag: {type: String, es_type: 'keyword'},
  type: {type: String, es_type: 'keyword'},
  taggable_id: {type: mongoose.Schema.Types.ObjectId},
  created_at: {type: Date, default: Date.now }
});
TaggableSchema.index({ tag: 1, type: 1});

/**
 * Methods
 */
TaggableSchema.statics = {
  /**
   *
   * @param meta; {type, taggable_id, tags}
     */
  addTags(meta){

    var type = meta.type;
    var taggable_id = meta.taggable_id;
    var tags = meta.tags;
    tags.forEach((tag) => {
      this.createAsync({
        tag: tag,
        taggable_id: taggable_id,
        type: type
      })
      .catch(err => {
        console.error(err);
      });
    });
  },

  removeTaggable(type, taggable_id){
    this.removeAsync({type: type, taggable_id: taggable_id})
    .then( result => {
      //console.log(`Remove Taggable: ${result}`);
    })
    .catch(err => {
      console.error(err);
    });
  }
};

export default mongoose.model('Taggable', TaggableSchema);
