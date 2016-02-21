'use strict';

angular.module('smartPlugApp')
  .factory('Mail', ['$resource',
    function($resource) {
      return $resource('/api/mails/', { id: '@_id'},{
        update: { method: 'PUT'}
      });
    }
  ]);
