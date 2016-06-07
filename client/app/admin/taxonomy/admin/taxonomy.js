'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.products.taxonomies', {
        abstract: true,
        parent: 'admin.products',
        url: '/taxonomies',
        template: '<ui-view/>'
      })
      .state('admin.products.taxonomies.list', {
        url: '',
        templateUrl: 'app/admin/taxonomy/admin/taxonomy.html',
        controller: 'AdminTaxonomyCtrl',
        controllerAs: 'vm'
      })
      .state('admin.products.taxonomies.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/taxonomy/admin/taxonomy.edit.html',
        controller: 'EditTaxonomyCtrl',
        controllerAs: 'vm'
      });
  });
