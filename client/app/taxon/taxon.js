'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('taxons', {
        parent: 'site',
        abstract: true,
        url: '/taxons',
        templateUrl: 'app/product/layout.html'
      })
      .state('taxons.products', {
        url: '/:id/products',
        templateUrl: 'app/taxon/taxon.html',
        controller: 'TaxonCtrl',
        controllerAs: 'vm'
      })
      .state('taxons.search', {
        url: '/:id/search/:q',
        templateUrl: 'app/taxon/taxon.html',
        controller: 'TaxonCtrl',
        controllerAs: 'vm'
      });
  });
