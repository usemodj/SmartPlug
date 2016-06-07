'use strict';

angular.module('smartPlugApp')
  .factory('Order', ['$resource',
    function($resource) {
      return $resource('/api/orders/:id/:controller', { id: '@_id'},{
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
        state: {
          method: 'POST',
          params: {
            controller: 'state'
          }
        },
        address: {
          method: 'POST',
          params: {
            controller: 'address'
          }
        },
        shipping: {
          method: 'POST',
          params: {
            controller: 'shipping'
          }
        },
        payment: {
          method: 'POST',
          params: {
            controller: 'payment'
          }
        },
        confirm: {
          method: 'POST',
          params: {
            controller: 'confirm'
          }
        },
        updatePayment: {
          method: 'POST',
          params: {
            controller: 'updatePayment'
          }
        }
      });
    }
  ]);
