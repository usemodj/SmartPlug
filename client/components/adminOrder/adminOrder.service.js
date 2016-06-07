'use strict';

angular.module('smartPlugApp')
  .factory('AdminOrder', ['$resource',
    function($resource) {
      return $resource('/api/admin/orders/:id/:controller', { id: '@_id'},{
        //query
        //save
        //delete or remove

        update: { method: 'PUT'},
        view: {
          method: 'GET',
          params: {
            controller: 'view'
          }
        }
      });
    }
  ]);

