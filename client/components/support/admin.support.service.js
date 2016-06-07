'use strict';

angular.module('smartPlugApp.admin')
  .factory('AdminSupport',  ['$resource',
    function($resource) {
      return $resource('/api/admin/supports/:id/:controller/:comment_id', { id: '@_id', comment_id:'@comment_id'},{
        //query
        //save
        //delete or remove

        update: { method: 'PUT'},
        close: { //close ticket
          method: 'POST',
          params: {
            id: '@_id',
            controller: 'close'
          }
        },
        removeFile: {
          method: 'POST',
          params: {
            id: '@_id',
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
            id: '@_id',
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
