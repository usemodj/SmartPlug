'use strict';

class AdminVariantCtrl {
  constructor(Auth, Product, Variant, $state, $stateParams, $http, $scope, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.Variant = Variant;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$filter = $filter;
    this.socket = socket;
    this.variants = $scope.variants = [];
    this.variant = { active: true, option_values: {}};
    this.product = {};
    this.deleted = false;
    this.beforeSort = '';
    this.sorted = false;

    var self = this;

    this.sortableOptions = {
      change: function(e, ui) {
        var entry = self.variants.map(function(item){
          return item._id;
        }).join(',');
        self.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = self.variants.map(function(item){
          return item._id;
        }).join(',');
        self.sorted = entry !== self.beforeSort;
        // IF sorted == true, updatePosition()
        if(self.sorted){
          self.updatePosition(entry);
        }
      }
    };

    this.Product.get({id: $stateParams.product_id}).$promise
    .then(response => {
        //console.log(response)
        this.product = response;
        this.product.variant = response.variants[0];
      })
    .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });

    this.list(this.deleted);
  }

  updatePosition(entry){
    this.Variant.position({entry: entry}).$promise
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  list(deleted){
    this.submitted = true;
    this.Variant.query({product: this.$stateParams.product_id, deleted: deleted}).$promise
      .then(response => {
        this.variants = this.$filter('orderBy')(response, 'position', false);
        this.socket.syncUpdates('variant', this.variants);
      })
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  show(deleted){
    this.deleted = deleted;
    this.list(deleted);
  }

  save(form){
    this.variant.product = this.$stateParams.product_id;
    this.Variant.save(this.variant).$promise
      .then((response) => {
        this.$state.go('admin.products.variants.list', {product_id: this.$stateParams.product_id}, {reload: true});
      })
      .catch(err => {
        this.errors.other = err.message || err.data || err;
      });
  }

  delete(variant){
    this.submitted = true;
    this.Variant.delete( {id: variant._id}).$promise
      .catch(err => {
        this.errors.other = err.message || err.data || err;
      });
  }
}

angular.module('smartPlugApp.admin')
  .controller('AdminVariantCtrl', AdminVariantCtrl);

class EditVariantCtrl {
  constructor(Auth, Product, Variant, $scope, $state, $stateParams, $filter) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.Variant = Variant;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.variant = {
      options: {}
    };

    Variant.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response)
        this.variant = response;
        this.variant.options = {};
        if(response.option_values){
          for(var i=0; i < response.option_values.length; ++i){
            if(response.option_values[i]) {
              this.variant.options[response.option_values[i].option_type] = response.option_values[i]._id;
            }
          }
        }
        //console.log(this.variant);
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });

    Product.get({id: $stateParams.product_id}).$promise
    .then(response => {
        this.product = response;
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  save(form){
    var self = this;
    self.submitted = true;
    if(form.$valid) {
      console.log(this.variant);
      self.variant.option_values = [];
      for( var prop in self.variant.options){
        self.variant.option_values.push(self.variant.options[prop]);
      }
      self.Variant.update(self.variant).$promise
        .then( response => {
          self.success = 'Variant is updated successfully!';
          this.$state.go('admin.products.variants.list', {product_id: this.$stateParams.product_id});
        })
        .catch(err => {
          console.error(err);
          self.errors.other = err.message || err.data || err;
        });
    }
  }

  cancel(){
    if(this.variant && this.variant.$get){
      this.variant.$get();
    }
  }

  back(){
    this.$state.go('admin.products.variants.list', {product_id: this.$stateParams.product_id});
  }

}

angular.module('smartPlugApp.admin')
  .controller('EditVariantCtrl', EditVariantCtrl);
