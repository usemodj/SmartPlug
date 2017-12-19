'use strict';

angular.module('smartPlugApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        abstract: true,
        authenticate: 'admin',
        url: '/users',
        template: '<ui-view/>'
      })
      .state('admin.users.list', {
        url: '',
        templateUrl: 'app/admin/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'vm'
      });
  });
