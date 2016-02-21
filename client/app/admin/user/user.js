'use strict';

angular.module('smartPlugApp.admin')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        abstract: true,
        parent: 'admin',
        authenticate: 'admin',
        url: '/users',
        template: '<div ui-view></div>'
      })
      .state('admin.users.list', {
        authenticate: 'admin',
        url: '',
        templateUrl: 'app/admin/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'vm'
      });

  });
