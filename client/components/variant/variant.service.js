'use strict';

angular.module('smartPlugApp')
  .factory('Variant', ['$resource',
    function($resource) {
      return $resource('/api/variants/:id/:controller', { id: '@_id'},{
        //query : GET
        //get : GET
        //save : POST
        //delete, remove : DELETE
        update: { method: 'PUT'},
        //search: {
        //  method: 'POST',
        //  params: {
        //    controller: 'search'
        //  }
        //},
        list: {
          method: 'POST', isArray:true,
          params: {
            controller: 'list'
          }
        },
        position: {
          method: 'POST',
          params: {
            controller: 'position'
          }
        }
      });
    }
  ]);
