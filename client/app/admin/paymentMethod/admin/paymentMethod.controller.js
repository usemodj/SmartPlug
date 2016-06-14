'use strict';

class AdminPaymentMethodCtrl {
  constructor(Auth, PaymentMethod, $state, $stateParams, $scope, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.PaymentMethod = PaymentMethod;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$filter = $filter;
    this.socket = socket;
    this.paymentMethods = [];
    this.paymentMethod = { active:true };
    this.beforeSort = '';
    this.sorted = false;

    var self = this;

    this.sortableOptions = {
      change: function(e, ui) {
        var entry = self.paymentMethods.map(function(item){
          return item._id;
        }).join(',');
        self.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = self.paymentMethods.map(function(item){
          return item._id;
        }).join(',');
        self.sorted = entry !== self.beforeSort;
        // IF sorted == true, updatePosition()
        if(self.sorted){
          self.updatePosition(entry);
        }
      }
    };

    this.list();
  }

  updatePosition(entry){
    this.PaymentMethod.position({entry: entry}).$promise
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  list(){
    this.submitted = true;
    this.PaymentMethod.query().$promise
      .then(response => {
        this.paymentMethods = this.$filter('orderBy')(response, 'position', false);
        this.socket.syncUpdates('paymentMethod', this.paymentMethods);
      })
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  save(form){
    this.PaymentMethod.save(this.paymentMethod).$promise
      .then((response) => {
        this.paymentMethod = {active:true};
        this.$state.go('admin.products.paymentMethods.list');
      })
      .catch(err => {
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  delete(item){
    this.submitted = true;
    this.PaymentMethod.delete( {id: item._id}).$promise
      .catch(err => {
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }
}

angular.module('smartPlugApp.admin')
  .controller('AdminPaymentMethodCtrl', AdminPaymentMethodCtrl);

class EditPaymentMethodCtrl {
  constructor(Auth, PaymentMethod, $scope, $state, $stateParams, $filter) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.PaymentMethod = PaymentMethod;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.paymentMethod = {};

    PaymentMethod.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.paymentMethod = response;
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  save(form){
    var self = this;
    self.submitted = true;
    if(form.$valid) {
      self.PaymentMethod.update(self.paymentMethod).$promise
        .then( response => {
          self.paymentMethod = response;
          self.success = 'PaymentMethod is updated successfully!';
          self.$state.go('admin.products.paymentMethods.list');
        })
        .catch(err => {
          console.error(err);
          self.errors.other = err.message || err.statusText || err.data || err;
        });
    }
  }

  back(){
    this.$state.go('admin.products.paymentMethods.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('EditPaymentMethodCtrl', EditPaymentMethodCtrl);
