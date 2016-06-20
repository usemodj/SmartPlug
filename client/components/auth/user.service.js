'use strict';

(function() {

function UserResource($resource) {
  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller:'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id:'me'
      }
    },
    getForgotPasswordToken: {
      method: 'GET',
      params: {
        id: 'token',
        controller: 'forgotPassword'
      }
    },
    mailForgotPasswordToken: {
      method: 'GET',
      params: {
        id: 'token',
        controller: 'mailForgotPasswordToken'
      }
    },
    resetPasswordByToken: {
      method: 'PUT',
      params: {
        id: 'token',
        controller: 'resetPassword'
      }
    }
  });
}

angular.module('smartPlugApp.auth')
  .factory('User', UserResource);

})();
