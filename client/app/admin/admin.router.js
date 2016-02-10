'use strict';

angular.module('smartPlugApp.admin')
  .config(function($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        authenticate: 'admin',
        url: '/admin',
        templateUrl: 'app/admin/layout.html'
      })
      .state('admin.list', {
        url: '/list',
        views: {
          '': {
            templateUrl: 'app/admin/admin.html',
            controller: 'AdminController',
            controllerAs: 'admin'
          }
        }
      });
  });
