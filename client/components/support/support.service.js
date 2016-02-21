'use strict';

angular.module('smartPlugApp')
  .factory('Support',  ['$resource',
    function($resource) {
      return $resource('/api/supports/:id/:controller/:comment_id', { id: '@_id', comment_id:'@comment_id'},{
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
