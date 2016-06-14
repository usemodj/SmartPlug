'use strict';

class AdminOrderCtrl {
  constructor(Auth, AdminOrder, Modal, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.AdminOrder = AdminOrder;
    this.Modal = Modal;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.orders = $scope.orders = [];
    this.q = {};
    var self = this;

    $scope.perPage = parseInt($location.search().perPage, 10) || 10;
    $scope.page = parseInt($location.search().page, 10) || 0;
    $scope.clientLimit = 250;

    $scope.$watch('page', function(page) { $location.search('page', page); });
    $scope.$watch('perPage', function(page) { $location.search('perPage', page); });
    $scope.$on('$locationChangeSuccess', function() {
      var page = +$location.search().page,
        perPage = +$location.search().perPage;
      if(page >= 0) { $scope.page = page; }
      if(perPage >= 0) { $scope.perPage = perPage; }
    });

    $scope.urlParams = {
      clientLimit: $scope.clientLimit,
      q: this.q
    };

    $scope.url = '/api/admin/orders';

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      socket.syncUpdates('order', self.orders);
    });
  }

  search(form){
    this.submitted = true;
    this.$scope.urlParams = {
      clientLimit: this.$scope.clientLimit,
      q: this.q
    };
    this.$scope.url = `/api/admin/orders?ts=${new Date().getTime()}`;

  }

  delete(item){
    return this.Modal.confirm.delete( item => {
      this.submitted = true;
      this.Order.delete({id: item._id}, () => {
        this.products.splice(this.orders.indexOf(item), 1);
      }, (err) => {
        this.errors.other = err.statusText || err;
      });
    });
  }
}
angular.module('smartPlugApp.admin')
  .controller('AdminOrderCtrl', AdminOrderCtrl);

class EditOrderCtrl {
  constructor(Auth, AdminOrder, $state, $stateParams, $http, $scope, $location, $window, socket, Modal) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.AdminOrder = AdminOrder;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.socket = socket;
    this.Modal = Modal;
    this.order = {};
    var self = this;

    this.paid = Modal.confirm.continue( () => {
      AdminOrder.paid({_id: this.order._id}).$promise
      .then(response => {
          this.order.payment_state = response.payment_state;
          this.order.shipment_state = response.shipment_state;
        });
    });

    this.shipped = Modal.confirm.continue( () => {
      AdminOrder.shipped({_id: this.order._id, ship_info: this.order.ship_info}).$promise
        .then(response => {
          this.order.shipment_state = response.shipment_state;
        });
    });

    this.state = Modal.confirm.continue( () => {
      if(!this.order.state) {return;}
      AdminOrder.state({_id: this.order._id, state: this.order.state}).$promise
        .then(response => {
          this.order.state = response.state;
        });
    });

    this.AdminOrder.get({id: this.$stateParams.id}).$promise
    .then(response => {
        //console.log(response)
        this.order = response;
      })
    .catch(err => {
        this.errors.other = err.statusText || err.data || err;
      });
  }

  save(form){
    this.submitted = true;
    this.AdminOrder.update(this.order).$promise
    .then(response => {

      })
    .catch(err => {
        this.errors.other = err.statusText || err.data || err;
      });
  }
}
angular.module('smartPlugApp.admin')
  .controller('EditOrderCtrl', EditOrderCtrl);

class StateOrderCtrl {
  constructor(Auth, AdminOrder, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.AdminOrder = AdminOrder;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.stateChanges = [];
    var self = this;

    $scope.perPage = parseInt($location.search().perPage, 10) || 10;
    $scope.page = parseInt($location.search().page, 10) || 0;
    $scope.clientLimit = 250;

    $scope.$watch('page', function(page) { $location.search('page', page); });
    $scope.$watch('perPage', function(page) { $location.search('perPage', page); });
    $scope.$on('$locationChangeSuccess', function() {
      var page = +$location.search().page,
        perPage = +$location.search().perPage;
      if(page >= 0) { $scope.page = page; }
      if(perPage >= 0) { $scope.perPage = perPage; }
    });

    $scope.urlParams = {
      clientLimit: $scope.clientLimit
    };

    $scope.url = `/api/admin/orders/${$stateParams.id}/stateChanges`;

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      socket.syncUpdates('stateChange', self.stateChanges);
    });
  }

}
angular.module('smartPlugApp.admin')
  .controller('StateOrderCtrl', StateOrderCtrl);
