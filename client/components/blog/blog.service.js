'use strict';

angular.module('smartPlugApp')
  .factory('Blog', ['$resource',
    function($resource) {
      return $resource('/api/blogs/:id/:controller/:comment_id', { id: '@_id', comment_id:'@comment_id'},{
        update: { method: 'PUT'},
        removeFile: {
          method: 'POST',
          params: {
            controller: 'removeFile'
          }
        },
        addComment: {
          method: 'POST',
          params: {
            controller: 'comment'
          }
        },
        deleteComment: {
          method: 'DELETE',
          params: {
            controller: 'comment'
          }
        },
        saveComment: {
          method: 'POST',
          params: {
            controller: 'comment'
          }
        }
      });
    }
  ]);
