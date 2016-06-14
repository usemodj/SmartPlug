'use strict';

class TaxonCtrl {
  constructor(Auth, Taxon, $state, $stateParams, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Taxon = Taxon;
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

    //$scope.$watch('vm.products', products => {
    //  console.log(products)
    //});

    $scope.$watch('page', function(page) { $location.search('page', page); });
    $scope.$watch('perPage', function(page) { $location.search('perPage', page); });
    $scope.$on('$locationChangeSuccess', function() {
      var page = +$location.search().page,
        perPage = +$location.search().perPage;
      if(page >= 0) { $scope.page = page; }
      if(perPage >= 0) { $scope.perPage = perPage; }
    });

    this.q = $stateParams.q? $stateParams.q: '';
    $scope.urlParams = {
      clientLimit: $scope.clientLimit,
      q: this.q
    };

    $scope.url = `/api/taxons/${$stateParams.id}/products`;

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      socket.syncUpdates('product', self.products);
    });
  }

  search(form){
    this.submitted = true;
    this.$window.location.href = `/taxons/${this.$stateParams.id}/search/${this.q}`;
  }

}

angular.module('smartPlugApp')
  .controller('TaxonCtrl', TaxonCtrl);
