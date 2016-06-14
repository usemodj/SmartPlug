'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.products.paymentMethods', {
        abstract: true,
        parent: 'admin.products',
        url: '/paymentMethods',
        template: '<ui-view/>'
      })
      .state('admin.products.paymentMethods.list', {
        url: '',
        templateUrl: 'app/admin/paymentMethod/admin/paymentMethod.html',
        controller: 'AdminPaymentMethodCtrl',
        controllerAs: 'vm'
      })
      .state('admin.products.paymentMethods.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/paymentMethod/admin/paymentMethod.edit.html',
        controller: 'EditPaymentMethodCtrl',
        controllerAs: 'vm'
      });
  });
