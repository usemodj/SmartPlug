'use strict';

class CartCtrl {
  constructor(Auth, Cart, $state, $stateParams, $scope, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Cart = Cart;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$window = $window;
    this.socket = socket;
    this.orders = $scope.orders = [];
    this.total = 0;

    this.list();
  }

  list(){
    this.submitted = true;
    this.Cart.query().$promise
    .then(response => {
        console.log(response);
        this.orders = response;
        this.total = 0;
        if(this.orders){
          this.orders.forEach(order => {
            this.total += order.quantity * order.variant.price;
          });
        }
        this.socket.syncUpdates('cart', this.orders);
      });
  }

  delete(lineItem){
    var self = this;
    self.Cart.delete({id: lineItem._id}).$promise
    .then(() => {
        self.total = 0;
        if(self.orders){
          self.orders.forEach(order => {
            self.total += order.quantity * order.variant.price;
          });
        }
      })
    .catch(err => {
        console.error(err);
        self.errors.other = err.message || err.data || err;
      });
  }

  save(form){
    this.Cart.update(this.orders).$promise
      .then(response => {
        this.$state.go('carts.list',{},{reload: true});
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  checkout(){
    this.Cart.checkout().$promise
    .then( response => {
        //console.log(response);
        this.$state.go('orders.checkout',{id: response._id});
      })
    .catch(err => {
        console.error(err);
        var data = err.data;
        data.forEach(item => {
          if(item.quantity > item.variant.quantity){
            $(`#${item._id}`).addClass('danger');
          }
        });

        this.errors.other = err.message || err.data || err;
      });
  }
}

angular.module('smartPlugApp')
  .controller('CartCtrl', CartCtrl);

