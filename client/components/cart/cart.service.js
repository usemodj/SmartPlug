'use strict';

angular.module('smartPlugApp')
  .factory('Cart', ['$resource',
    function($resource) {
      return $resource('/api/carts/:id/:controller', { id: '@_id'},{
        //query
        //get
        //save
        //delete, remove
        update: { method: 'PUT'},
        // search: {
        //  method: 'POST',
        //  params: {
        //    controller: 'search'
        //  }
        //},
        //list: {
        //  method: 'POST',
        //  params: {
        //    controller: 'list'
        //  }
        //},
        checkout: {
          method: 'GET',
          params: {
            controller: 'checkout'
          }
        }
      });
    }
  ]);
