'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('orders', {
        parent: 'site',
        abstract: true,
        url: '/orders',
        templateUrl: 'app/order/layout.html'
      })
      .state('orders.list', {
        url: '',
        templateUrl: 'app/order/order.html',
        controller: 'OrderCtrl',
        controllerAs: 'vm'
      })
      .state('orders.view', {
        url: '/:id',
        templateUrl: 'app/order/order.view.html',
        controller: 'ViewOrderCtrl',
        controllerAs: 'vm'
      })
      .state('orders.checkout', {
        url: '/:id/checkout',
        templateUrl: 'app/order/checkout.html',
        controller: 'CheckoutOrderCtrl',
        controllerAs: 'vm'
      })
      .state('orders.address', {
        url: '/:id/address',
        templateUrl: 'app/order/order.address.html',
        controller: 'AddressOrderCtrl',
        controllerAs: 'vm'
      })
      .state('orders.shipping', {
        url: '/:id/shipping',
        templateUrl: 'app/order/order.shipping.html',
        controller: 'ShippingOrderCtrl',
        controllerAs: 'vm'
      })
      .state('orders.payment', {
        url: '/:id/payment',
        templateUrl: 'app/order/order.payment.html',
        controller: 'PaymentOrderCtrl',
        controllerAs: 'vm'
      })
      .state('orders.confirm', {
        url: '/:id/complete',
        templateUrl: 'app/order/order.complete.html',
        controller: 'ConfirmOrderCtrl',
        controllerAs: 'vm'
      });
  });
