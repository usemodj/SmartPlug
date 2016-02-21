'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.supports', {
        abstract: true,
        parent: 'admin',
        url: '/supports',
        template: '<div ui-view></div>'
      })
      .state('admin.supports.list', {
        url: '',
        templateUrl: 'app/admin/support/support.html',
        controller: 'AdminSupportCtrl',
        controllerAs: 'vm'
      })
      .state('admin.supports.search', {
        url: '/search/:qsearch',
        templateUrl: 'app/admin/support/support.html',
        controller: 'AdminSupportCtrl',
        controllerAs: 'vm'
      })
      .state('admin.supports.tag', {
        url: '/tag/:tag',
        templateUrl: 'app/admin/support/support.html',
        controller: 'AdminSupportCtrl',
        controllerAs: 'vm'
      })
      .state('admin.supports.view', {
        url: '/:id',
        templateUrl: 'app/admin/support/support.view.html',
        controller: 'AdminViewSupportCtrl',
        controllerAs: 'vm'
      })
      .state('admin.supports.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/support/support.edit.html',
        controller: 'AdminEditSupportCtrl',
        controllerAs: 'vm'
      });

  });
