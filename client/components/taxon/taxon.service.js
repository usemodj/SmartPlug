'use strict';

angular.module('smartPlugApp')
  .factory('Taxon', ['$resource',
    function($resource) {
      return $resource('/api/taxons/:id/:controller', { id: '@_id'},{
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
        list: {
          method: 'POST',
          isArray: true,
          params: {
            controller: 'list'
          }
        },
        position: {
          method: 'POST',
          params: {
            controller: 'position'
          }
        },
        getProducts: {
          method: 'POST',
          params: {
            controller: 'products'
          }
        }
      });
    }
  ]);
