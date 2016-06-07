'use strict';

angular.module('smartPlugApp')
  .factory('PaymentMethod', ['$resource',
    function($resource) {
      return $resource('/api/paymentMethods/:id/:controller', { id: '@_id'},{
        //query
        //get
        //save
        //delete, remove
        update: { method: 'PUT'},
        //search: {
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
        position: {
          method: 'POST',
          params: {
            controller: 'position'
          }
        }
      });
    }
  ]);

