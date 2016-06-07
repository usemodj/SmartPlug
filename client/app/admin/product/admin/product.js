'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.products', {
        abstract: true,
        parent: 'admin',
        url: '/products',
        templateUrl: 'app/admin/product/admin/layout.html'
      })
      .state('admin.products.list', {
        url: '',
        templateUrl: 'app/admin/product/admin/product.html',
        controller: 'AdminProductCtrl',
        controllerAs: 'vm'
      })
      .state('admin.products.new', {
        url: '/new',
        templateUrl: 'app/admin/product/admin/product.new.html',
        controller: 'NewProductCtrl',
        controllerAs: 'vm'
      })
      .state('admin.products.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/product/admin/product.edit.html',
        controller: 'EditProductCtrl',
        controllerAs: 'vm',
        resolve: {
          //product: ['Product', '$stateParams', function(Product, $stateParams){
          //  return Product.get({id: $stateParams.id});
          //}],
          optionTypes: ['OptionType', function(OptionType){
            return OptionType.query();
          }],
          taxons: ['Taxon', function(Taxon){
            return Taxon.query();
          }]
        }
      })
      .state('admin.products.clone', {
        url: '/:id/clone',
        templateUrl: 'app/admin/product/admin/product.clone.html',
        controller: 'CloneProductCtrl',
        controllerAs: 'vm',
        resolve: {
          //product: ['Product', '$stateParams', function(Product, $stateParams){
          //  return Product.get({id: $stateParams.id});
          //}],
          optionTypes: ['OptionType', function(OptionType){
            return OptionType.query();
          }],
          taxons: ['Taxon', function(Taxon){
            return Taxon.query();
          }]
        }
      });

  });
