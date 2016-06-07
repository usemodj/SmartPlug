'use strict';

class OrderCtrl {
  constructor(Auth, Order, $state, $stateParams, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Order = Order;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.socket = socket;
    this.orders = $scope.orders = [];

    $scope.perPage = parseInt($location.search().perPage, 10) || 10;
    $scope.page = parseInt($location.search().page, 10) || 0;
    $scope.clientLimit = 250;

    $scope.$watch('page', function(page) { $location.search('page', page); });
    $scope.$watch('perPage', function(page) { $location.search('perPage', page); });
    $scope.$on('$locationChangeSuccess', function() {
      var page = +$location.search().page,
        perPage = +$location.search().perPage;
      if(page >= 0) { $scope.page = page; };
      if(perPage >= 0) { $scope.perPage = perPage; };
    });

    $scope.urlParams = {
      clientLimit: $scope.clientLimit
    };

    $scope.url = '/api/orders';

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      socket.syncUpdates('order', $scope.orders);
    });
  }

  //delete(lineItem){
  //  var self = this;
  //  self.Order.delete({id: lineItem._id}).$promise
  //    .then(() => {
  //      self.orders.splice(self.orders.indexOf(lineItem), 1);
  //      self.total = 0;
  //      if(self.orders){
  //        self.orders.forEach(order => {
  //          self.total += order.quantity * order.variant.price;
  //        });
  //      }
  //    })
  //    .catch(err => {
  //      console.error(err);
  //      self.errors.other = err.message || err.statusText || err.data || err;
  //    });
  //}
  //
  //save(form){
  //  this.Order.update(this.orders).$promise
  //    .then(response => {
  //      this.$state.go('orders.list',{},{reload: true});
  //    })
  //    .catch(err => {
  //      console.error(err);
  //      this.errors.other = err.message || err.statusText || err.data || err;
  //    });
  //}

}

angular.module('smartPlugApp')
  .controller('OrderCtrl', OrderCtrl);

class ViewOrderCtrl {
  constructor(Auth, Order, $uibModal, $state, $stateParams, $scope, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Order = Order;
    this.$uibModal = $uibModal;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.socket = socket;
    this.order = {};
    this.updatePayment = function(payment){
      Order.updatePayment(payment).$promise
      .then(response => {
          $state.go('orders.view', {id: $stateParams.id}, {reload: true});
        })
      .catch(err => {
          console.error(err);
          this.errors.other = err.message || err.statusText || err.data || err;
        });
    };

    Order.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.order = response;
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });

  }

  payByCreditCard(){
    var self = this;
    var modalInstance = this.$uibModal.open({
      templateUrl: 'app/order/order.paygate.html',
      controller: 'EditPaymentCtrl',
      controllerAs: 'vm',
      //scope: $('#paymentCtrl').scope(),
      windowClass: 'center-modal',
      resolve: {
        order: function(){
          return self.order;
        }
      }
    });
    modalInstance.result.then(editedPayment => {
      this.updatePayment(editedPayment);
    }, () => {//cancel
      this.$state.go('orders.view', {id: this.$stateParams.id}, {reload: true});
    });
  }

  confirm(){
    this.Order.confirm({_id: this.$stateParams.id}).$promise
      .then( response => {
        //console.log(response)
        this.$state.go('orders.view', {id: this.$stateParams.id}, {reload: true});
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }
}
angular.module('smartPlugApp')
  .controller('ViewOrderCtrl', ViewOrderCtrl);

//class EditPaymentCtrl {
//  constructor(Auth, $uibModalInstance, $state, $stateParams, $scope, order) {
//    this.errors = {};
//    this.success = '';
//    this.submitted = false;
//    this.$uibModalInstance = $uibModalInstance;
//    this.$state = $state;
//    this.$stateParams = $stateParams;
//    this.$scope = $scope;
//    this.order = order;
//    this.payment = {};
//    this.currentUser = Auth.getCurrentUser();
//
//    this.$scope.save = this.save;
//
//    console.log(this.$scope)
//    console.log(this.$uibModalInstance)
//  }
//
//  save(scope){
//    console.log(scope)
//    console.log(this.$scope)
//    console.log(this.$uibModalInstance)
//    this.payment = {
//      order: this.order,
//      amount: scope.unitprice,
//      identifier: scope.cardauthcode,
//      cvv_response_code: scope.replycode,
//      cvv_response_message: scope.replyMsg
//    };
//    //this.$uibModalInstance.close(this.payment);
//      scope.$close($scope.payment);
//  }
//
//  cancel(){
//    this.payment = {};
//    this.$uibModalInstance.dismiss('cancel');
//  }
//}
//angular.module('smartPlugApp')
//  .controller('EditPaymentCtrl', EditPaymentCtrl);

angular.module('smartPlugApp')
  .controller('EditPaymentCtrl', function(Auth, $uibModalInstance, $state, $stateParams, $scope, order) {
    $scope.order = order;
    $scope.payment = {};
    $scope.currentUser = Auth.getCurrentUser();

  $scope.save = function(scope){
    $scope.payment = {
      order: $scope.order,
      amount: scope.unitprice,
      card_auth_code: scope.cardauthcode,
      reply_code: scope.replycode,
      reply_msg: scope.replyMsg,
      card_number: scope.cardnumber,
      tid: scope.tid
    };
    //$uibModalInstance.close(this.payment);
    scope.$close($scope.payment);
  };

  $scope.cancel = function(){
    $scope.payment = {};
    $uibModalInstance.dismiss('cancel');
  };
});

class CheckoutOrderCtrl {
  constructor(Auth, Order, $state, $stateParams, $scope, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Order = Order;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.socket = socket;
    this.order = {};

    Order.get({id: $stateParams.id}).$promise
    .then(response => {
        //console.log(response);
        this.order = response;
        if(this.order.completed_at){
          this.$state.go('orders.view', {id: this.$stateParams.id});
        }
      })
    .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }


  address(){
    this.Order.state({_id: this.$stateParams.id, state: 'address'}).$promise
      .then(response => {
        this.$state.go('orders.address', {id: response._id});
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

}
angular.module('smartPlugApp')
  .controller('CheckoutOrderCtrl', CheckoutOrderCtrl);

class AddressOrderCtrl {
  constructor(Auth, Order, $state, $stateParams, $scope, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Order = Order;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.socket = socket;
    this.order = { use_bill_address: false};

    Order.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.order = response;
        if(this.order.completed_at){
          this.$state.go('orders.view', {id: this.$stateParams.id});
        }
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  useBillingAddress(){
    //console.log(this.order.use_bill_address);
    if(this.order.use_bill_address){
      this.order.ship_address = angular.copy(this.order.bill_address);
    } else {
      this.order.ship_address = {};
    }
  }

  save(form){
    this.Order.address(this.order).$promise
      .then(response => {
        this.$state.go('orders.shipping',{id: response._id});
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

}

angular.module('smartPlugApp')
  .controller('AddressOrderCtrl', AddressOrderCtrl);

class ShippingOrderCtrl {
  constructor(Auth, Order, ShippingMethod, $state, $stateParams, $scope, $window, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Order = Order;
    this.ShippingMethod = ShippingMethod;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.$filter = $filter;
    this.socket = socket;
    this.shippingMethods = [];
    this.order = {};

    Order.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.order = response;
        if(this.order.completed_at){
          this.$state.go('orders.view', {id: this.$stateParams.id});
        }
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });

    ShippingMethod.query({active:true}).$promise
    .then(response => {
        this.shippingMethods = this.$filter('orderBy')(response, 'position', false);
      })
    .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });

  }

  save(form){
    this.Order.shipping(this.order).$promise
      .then(response => {
        this.$state.go('orders.payment',{id: response._id});
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

}

angular.module('smartPlugApp')
  .controller('ShippingOrderCtrl', ShippingOrderCtrl);

class PaymentOrderCtrl {
  constructor(Auth, Order, PaymentMethod, $state, $stateParams, $scope, $window, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Order = Order;
    this.PaymentMethod = PaymentMethod;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.$filter = $filter;
    this.socket = socket;
    this.paymentMethods = [];
    this.order = {};

    Order.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.order = response;
        if(this.order.completed_at){
          this.$state.go('orders.view', {id: this.$stateParams.id});
        }
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });

    PaymentMethod.query({active:true}).$promise
      .then(response => {
        //console.log(response);
        this.paymentMethods = this.$filter('orderBy')(response, 'position', false);
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  save(form){
    this.Order.payment(this.order).$promise
      .then(response => {
        this.$state.go('orders.view',{id: response._id});
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

}

angular.module('smartPlugApp')
  .controller('PaymentOrderCtrl', PaymentOrderCtrl);

class ConfirmOrderCtrl {
  constructor(Auth, Order, $state, $stateParams, $scope, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Order = Order;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.socket = socket;
    this.order = {};

    Order.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.order = response;
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  useBillingAddress(){
    if(this.order.use_bill_address){
      this.order.ship_address = angular.copy(this.order.bill_address);
    } else {
      this.order.ship_address = {};
    }
  }

  save(form){
    this.Order.update(this.order).$promise
      .then(response => {
        this.$state.go('orders.payment',{id: response._id});
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

}
angular.module('smartPlugApp')
  .controller('ConfirmOrderCtrl', ConfirmOrderCtrl);
