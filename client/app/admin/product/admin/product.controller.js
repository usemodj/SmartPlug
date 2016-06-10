'use strict';

class AdminProductCtrl {
  constructor(Auth, Product, Modal, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.Modal = Modal;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.products = $scope.products = [];
    this.now = new Date();
    this.q = {};
    var self = this;

    this.delete = Modal.confirm.delete( product => {
      this.submitted = true;
      this.Product.delete( {id: product._id},() => {
        this.products.splice(this.products.indexOf(product), 1);
      }, (err) => {
        this.errors.other = err.statusText || err.data || err;
      });
    });

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
      clientLimit: $scope.clientLimit,
      q: this.q
    };

    $scope.url = '/api/products/list';

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      socket.syncUpdates('product', self.products);
    });
  }

  search(form){
    this.submitted = true;
    this.$scope.urlParams = {
      clientLimit: this.$scope.clientLimit,
      q: this.q
    };
    this.$scope.url = `/api/products/list?ts=${new Date()}`;

  }

}

angular.module('smartPlugApp.admin')
  .controller('AdminProductCtrl', AdminProductCtrl);

class NewProductCtrl {
  constructor(Auth, Product, $scope, $state) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.$state = $state;
    this.product = { active: true};
  }

  save(form){
    this.submitted = true;
    //console.log(this.product);
    if(form.$valid) {
      this.Product.save(this.product).$promise
        .then( response => {
          this.$state.go('admin.products.edit', {id: response._id});
        })
        .catch(err => {
          console.error(err);
          this.errors.other = err.message || err;
        });
    }
  }

  cancel(){
    if(this.product && this.product.$get){
      this.product.$get();
    }
    this.product = {};
    this.$state.go('admin.products.new');
  }

  back(){
    this.$state.go('admin.products.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('NewProductCtrl', NewProductCtrl);

class EditProductCtrl {
  constructor(Auth, Product, OptionType, Taxon, $scope, $state, $stateParams, $window, $filter, optionTypes, taxons) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.OptionType = OptionType;
    this.Taxon = Taxon;
    this.$state = $state;
    this.$scope = $scope;
    this.product = {};
    this.optionTypes = optionTypes;
    this.taxons = taxons;

    this.$scope.select2Options = {
      multiple:true, allowClear:true
    };

    Product.get({id: $stateParams.id}).$promise
    .then(response => {
        //console.log(response);
        this.product = response;
        this.product.available_on = $filter('date')(this.product.available_on, 'yyyy-MM-dd');
        this.product.deleted_at = $filter('date')(this.product.deleted_at, 'yyyy-MM-dd');
        if(this.product.variants){
          this.product.variant = this.product.variants[0];
        }
      })
    .catch(err => {
        console.error(err);
        this.errors.other = err.statusText || err.data || err;
      });
  }

  save(form){
    this.submitted = true;
    //console.log(this.product);
    if(form.$valid) {
      this.Product.update(this.product).$promise
        .then( response => {
          this.success = 'Updated successfully!';
        })
        .catch(err => {
          console.error(err);
          this.errors.other = err.statusText || err.data || err;
        });
    }
  }

  cancel(){
    if(this.product && this.product.$get){
      this.product.$get();
    }
    this.$state.go('admin.products.edit', {id: this.product._id});
  }

  back(){
    this.$state.go('admin.products.list');
  }

  getOptionTypes(){
    this.optionTypes = this.OptionType.query();
  }

  showSomeHelp(){
    $window.open("http://daringfireball.net/projects/markdown/syntax", "_blank");
  }
}

angular.module('smartPlugApp.admin')
  .controller('EditProductCtrl', EditProductCtrl);


class CloneProductCtrl {
  constructor(Auth, Product, OptionType, Taxon, $scope, $state, $stateParams, $window, $filter, optionTypes, taxons) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.OptionType = OptionType;
    this.Taxon = Taxon;
    this.$state = $state;
    this.product = {};
    this.optionTypes = optionTypes;
    this.taxons = taxons;

    Product.get({id: $stateParams.id}).$promise
      .then(response => {
        console.log(response);
        this.product = response;
        this.product.name = 'Copy of ' + this.product.name;
        this.product.available_on = $filter('date')(this.product.available_on, 'yyyy-MM-dd');
        this.product.deleted_at = $filter('date')(this.product.deleted_at, 'yyyy-MM-dd');
        if(this.product.variants){
          this.product.variant = this.product.variants[0];
        }
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.statusText || err.data || err;
      });
  }

  save(form){
    this.submitted = true;
    if(form.$valid) {
      this.product._id = null;
      this.Product.clone(this.product).$promise
        .then( response => {
          this.success = 'Product is created!';
          this.$state.go('admin.products.edit', {id: response._id});
        })
        .catch(err => {
          console.error(err);
          this.errors.other = err.statusText || err.data || err;
        });
    }
  }

  cancel(){
    if(this.product && this.product.$get){
      this.product.$get();
    }
    this.$state.go('admin.products.edit', {id: this.product._id});
  }

  back(){
    this.$state.go('admin.products.list');
  }

  getOptionTypes(){
    this.optionTypes = this.OptionType.query();
  }

  showSomeHelp(){
    $window.open("http://daringfireball.net/projects/markdown/syntax", "_blank");
  }
}

angular.module('smartPlugApp.admin')
  .controller('CloneProductCtrl', CloneProductCtrl);
