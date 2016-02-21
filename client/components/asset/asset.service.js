'use strict';

angular.module('smartPlugApp')
  .factory('Asset', ['$resource',
    function($resource) {
      return $resource('/api/assets', { id: '@_id'},{
        update: { method: 'PUT'}
      });
    }
  ]);
