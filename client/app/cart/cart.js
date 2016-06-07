'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('carts', {
        parent: 'site',
        abstract: true,
        url: '/carts',
        template: '<ui-view/>'
      })
      .state('carts.list', {
        url: '',
        templateUrl: 'app/cart/cart.html',
        controller: 'CartCtrl',
        controllerAs: 'vm'
      });
  });
