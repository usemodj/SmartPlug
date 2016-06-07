'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.products.assets', {
        abstract: true,
        parent: 'admin.products',
        url: '/:product_id/assets',
        templateUrl: 'app/admin/asset/admin/layout.html'
      })
      .state('admin.products.assets.list', {
        url: '',
        templateUrl: 'app/admin/asset/admin/asset.html',
        controller: 'AdminAssetCtrl',
        controllerAs: 'vm'
      });
  });
