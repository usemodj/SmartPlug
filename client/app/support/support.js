'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('supports', {
        parent: 'site',
        abstract: true,
        authenticate: true,
        url: '/supports',
        template: '<div ui-view></div>'
      })
      .state('supports.list', {
        url: '',
        templateUrl: 'app/support/support.html',
        controller: 'SupportCtrl',
        controllerAs: 'vm'
      })
      .state('supports.search', {
        url: '/search/:qsearch',
        templateUrl: 'app/support/support.html',
        controller: 'SupportCtrl',
        controllerAs: 'vm'
      })
      .state('supports.tag', {
        url: '/tag/:tag',
        templateUrl: 'app/support/support.html',
        controller: 'SupportCtrl',
        controllerAs: 'vm'
      })
      .state('supports.new', {
        url: '/new',
        templateUrl: 'app/support/support.new.html',
        controller: 'NewSupportCtrl',
        controllerAs: 'vm'
      })
      .state('supports.view', {
        url: '/:id',
        templateUrl: 'app/support/support.view.html',
        controller: 'ViewSupportCtrl',
        controllerAs: 'vm'
      })
      .state('supports.edit', {
        url: '/:id/edit',
        templateUrl: 'app/support/support.edit.html',
        controller: 'EditSupportCtrl',
        controllerAs: 'vm'
      });

  });
