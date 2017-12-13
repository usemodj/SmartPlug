'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.orders', {
        abstract: true,
        //parent: 'admin',
        url: '/orders',
        templateUrl: 'app/admin/order/admin/layout.html'
      })
      .state('admin.orders.list', {
        url: '',
        templateUrl: 'app/admin/order/admin/order.html',
        controller: 'AdminOrderCtrl',
        controllerAs: 'vm'
      })
      .state('admin.orders.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/order/admin/order.edit.html',
        controller: 'EditOrderCtrl',
        controllerAs: 'vm'
      })
      .state('admin.orders.states', {
        url: '/:id/states',
        templateUrl: 'app/admin/order/admin/order.state.html',
        controller: 'StateOrderCtrl',
        controllerAs: 'vm'
      });
  });
