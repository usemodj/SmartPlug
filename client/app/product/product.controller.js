'use strict';

class ProductCtrl {
  constructor(Auth, Product, $state, $stateParams, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$location = $location;
    this.$window = $window;
    this.products = $scope.products = [];
    this.q = '';
    var self = this;

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

    this.q = $stateParams.q? $stateParams.q: '';
    $scope.urlParams = {
      clientLimit: $scope.clientLimit,
      q: this.q
    };

    $scope.url = `/api/products`;

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      socket.syncUpdates('product', self.products);
    });
  }

  search(form){
    this.submitted = true;
    this.$window.location.href = `/products/search/${this.q}`;
  }

}

angular.module('smartPlugApp')
  .controller('ProductCtrl', ProductCtrl);

class ViewProductCtrl {
  constructor(Auth, Product, Cart, $scope, $state, $stateParams, $filter) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Product = Product;
    this.Cart = Cart;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.product = {};
    this.order = { quantity: 1};
    this.mainImage = '';

    Product.view({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.product = response;
        if(this.product){
          this.order.name = this.product.name;
        }
        this.assets = $filter('orderBy')(response.assets, ['position', 'id']);
        if(response.assets){
          this.mainImage = '/assets/upload/'+ this.assets[0].uri;
          this.order.uri = this.assets[0].uri;
        }
        if(this.product.variants) {
          this.order.variant = this.product.variants[0];
          this.product.variants.forEach(variant => {
            //console.log(variant);
            var options = [];
            variant.option_values.forEach(value => {
              options.push(value.option_type.presentation + ':' + value.presentation);
            });
            variant.options = options.join(', ');
          });
        }
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  addToCart(){
    if(!this.Auth.isLoggedIn()){
      return this.$state.go('login');
    }
    //console.log(this.order);
    this.Cart.save(this.order).$promise
    .then(response => {
        this.$state.go('carts.list');
      });
  }

  viewImage(path){
    this.mainImage = '/assets/upload/'+ path;
  }

}

angular.module('smartPlugApp')
  .controller('ViewProductCtrl', ViewProductCtrl);
