'use strict';

class AdminShippingMethodCtrl {
  constructor(Auth, ShippingMethod, $state, $stateParams, $scope, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.ShippingMethod = ShippingMethod;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$filter = $filter;
    this.socket = socket;
    this.shippingMethods = [];
    this.shippingMethod = {active:true};
    this.beforeSort = '';
    this.sorted = false;

    var self = this;

    this.sortableOptions = {
      change: function(e, ui) {
        var entry = self.shippingMethods.map(function(item){
          return item._id;
        }).join(',');
        self.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = self.shippingMethods.map(function(item){
          return item._id;
        }).join(',');
        self.sorted = entry != self.beforeSort;
        // IF sorted == true, updatePosition()
        if(self.sorted){
          self.updatePosition(entry);
        }
      }
    };

    this.list();
  }

  updatePosition(entry){
    this.ShippingMethod.position({entry: entry}).$promise
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });

  };

  list(){
    this.submitted = true;
    this.ShippingMethod.query().$promise
      .then(response => {
        this.shippingMethods = this.$filter('orderBy')(response, 'position', false);
        this.socket.syncUpdates('shippingMethod', this.shippingMethods);
      })
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  save(form){
    this.ShippingMethod.save(this.shippingMethod).$promise
      .then((response) => {
        this.shippingMethod = {active:true};
        this.$state.go('admin.products.shippingMethods.list');
      })
      .catch(err => {
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  delete(shippingMethod){
    this.submitted = true;
    this.ShippingMethod.delete( {id: shippingMethod._id}).$promise
      .catch(err => {
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }
}

angular.module('smartPlugApp.admin')
  .controller('AdminShippingMethodCtrl', AdminShippingMethodCtrl);

class EditShippingMethodCtrl {
  constructor(Auth, ShippingMethod, $scope, $state, $stateParams, $filter) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.ShippingMethod = ShippingMethod;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.shippingMethod = {};

    ShippingMethod.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.shippingMethod = response;
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
      self.ShippingMethod.update(self.shippingMethod).$promise
        .then( response => {
          self.shippingMethod = response;
          self.success = 'ShippingMethod is updated successfully!';
          self.$state.go('admin.products.shippingMethods.list');
        })
        .catch(err => {
          console.error(err);
          self.errors.other = err.message || err.statusText || err.data || err;
        });
    }
  }

  back(){
    this.$state.go('admin.products.shippingMethods.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('EditShippingMethodCtrl', EditShippingMethodCtrl);
