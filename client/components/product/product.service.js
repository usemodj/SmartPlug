'use strict';

angular.module('smartPlugApp')
  .factory('Product', ['$resource',
    function($resource) {
      return $resource('/api/products/:id/:controller', { id: '@_id'},{
        update: { method: 'PUT'},
        clone: {
          method: 'POST',
          params: {
            controller: 'clone'
          }
        },
        view: {
          method: 'GET',
          params: {
            controller: 'view'
          }
        }
      });
    }
  ]);

