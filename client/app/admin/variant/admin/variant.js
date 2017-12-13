'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.products.variants', {
        abstract: true,
        //sparent: 'admin.products',
        url: '/:product_id/variants',
        templateUrl: 'app/admin/variant/admin/layout.html'
      })
      .state('admin.products.variants.list', {
        url: '',
        templateUrl: 'app/admin/variant/admin/variant.html',
        controller: 'AdminVariantCtrl',
        controllerAs: 'vm'
      })
      .state('admin.products.variants.edit', {
        url: '/:id',
        templateUrl: 'app/admin/variant/admin/variant.edit.html',
        controller: 'EditVariantCtrl',
        controllerAs: 'vm'
      });
  });
