'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('products', {
        parent: 'site',
        abstract: true,
        url: '/products',
        templateUrl: 'app/product/layout.html'
      })
      .state('products.list', {
        url: '',
        templateUrl: 'app/product/product.html',
        controller: 'ProductCtrl',
        controllerAs: 'vm'
      })
      .state('products.view', {
        url: '/:id',
        templateUrl: 'app/product/product.view.html',
        controller: 'ViewProductCtrl',
        controllerAs: 'vm'
      })
      .state('products.search', {
        url: '/search/:q',
        templateUrl: 'app/product/product.html',
        controller: 'ProductCtrl',
        controllerAs: 'vm'
      });
  });
