'use strict';

angular.module('smartPlugApp')
  .factory('Taxonomy', ['$resource',
    function($resource) {
      return $resource('/api/taxonomys/:id/:controller', { id: '@_id'},{
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
        },
        objectId: {
          method: 'POST',
          params: {
            controller: 'objectId'
          }
        }
      });
    }
  ]);
