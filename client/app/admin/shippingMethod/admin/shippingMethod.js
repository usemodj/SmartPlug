'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.products.shippingMethods', {
        abstract: true,
        //parent: 'admin.products',
        url: '/shippingMethods',
        template: '<ui-view/>'
      })
      .state('admin.products.shippingMethods.list', {
        url: '',
        templateUrl: 'app/admin/shippingMethod/admin/shippingMethod.html',
        controller: 'AdminShippingMethodCtrl',
        controllerAs: 'vm'
      })
      .state('admin.products.shippingMethods.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/shippingMethod/admin/shippingMethod.edit.html',
        controller: 'EditShippingMethodCtrl',
        controllerAs: 'vm'
      });
  });
