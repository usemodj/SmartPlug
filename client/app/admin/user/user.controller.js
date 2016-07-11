'use strict';

class UserCtrl {
  constructor($state, $stateParams, $scope, $location, $window, $uibModal, socket, appConfig) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$location = $location;
    this.$window = $window;
    this.$uibModal = $uibModal;
    this.socket = socket;
    this.appConfig = appConfig;
    this.clientLimit = 250;
    this.users = [];
    this.conditions = {};

    this.$onInit();
  }

  $onInit(timestamp){
    var self = this;
    self.submitted = true;
    self.q = self.$stateParams.q;
    self.perPage = parseInt(self.$location.search().perPage, 10) || 10;
    self.page = parseInt(self.$location.search().page, 10) || 0;

    self.$scope.$watch('page', function(page) { self.$location.search('page', page); });
    self.$scope.$watch('perPage', function(page) { self.$location.search('perPage', page); });
    self.$scope.$on('$locationChangeSuccess', function() {
      var page = +self.$location.search().page,
        perPage = +self.$location.search().perPage;
      if(page >= 0) { self.page = page; }
      if(perPage >= 0) { self.perPage = perPage; }
    });

    self.urlParams = self.conditions;
    self.urlParams.clientLimit = self.clientLimit;

    self.url = `/api/users?ts=${timestamp || new Date().getTime()}`;

    self.$scope.$on('$destroy', function() {
      self.socket.unsyncUpdates('user');
    });

    self.$scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      self.socket.syncUpdates('user', self.users);
    });

  }

  search(form){
    this.$onInit(new Date().getTime());
  }

  editUser(user){
    this.submitted = true;
    var modalInstance = this.$uibModal.open({
      templateUrl: 'app/admin/user/user.edit.html',
      controller: EditUserCtrl,
      controllerAs: 'vm',
      resolve: {
        user: function(){
          return user;
        }
      }
    });
    modalInstance.result.then((editedUser) => {
      this.saveUser(editedUser);
    })
      .catch(err => {
        console.log(err);
      });
  }

  saveUser(user){
    this.$http.post('/api/users/updateUser', {user})
    .then(() => {
        console.log('update user');
      });
  }

}

angular.module('smartPlugApp.admin')
  .controller('UserCtrl', UserCtrl);

class EditUserCtrl {
  constructor($uibModalInstance, appConfig, user){
    this.$uibModalInstance = $uibModalInstance;
    this.appConfig = appConfig;
    this.user = user;
    this.oldUser = angular.copy(user);
  }

  saveUser(form){
    this.submitted = true;
    if(form.$valid) {
      this.$uibModalInstance.close(this.user);
    }
  }

  cancelEdit(){
    this.user.role = this.oldUser.role;
    this.user.active = this.oldUser.active;
    this.$uibModalInstance.dismiss('cancel');
  }
}
angular.module('smartPlugApp.admin')
  .controller('EditUserCtrl', EditUserCtrl);
