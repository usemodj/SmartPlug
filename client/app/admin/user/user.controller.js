'use strict';

class UserCtrl {
  constructor(Auth, $state, $stateParams, $http, $scope, $location, $window, $uibModal, socket, appConfig) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.$scope = $scope;
    this.$window = $window;
    this.appConfig = appConfig;
    this.users = [];
    this.conditions = {};
    this.user = {};

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

    var tag = $stateParams.tag;
    this.qsearch = $stateParams.qsearch;
    if(this.qsearch){
      $scope.url = `/api/users/search/${this.qsearch}`;
    } else {
      $scope.url = '/api/users';
      //$http.get('/api/blogs').then(response => {
      //  this.blogs = response.data;
      //  socket.syncUpdates('blog', this.blogs);
      //});
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('user');
    });

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      socket.syncUpdates('user', $scope.users);
    });
  }

  searchUsers(form){
    this.submitted = true;
    //this.$window.location.href = '/admin/users';
    this.$scope.url = '/api/users';
    this.$scope.urlParams.email = this.conditions.email;
    this.$scope.urlParams.role = this.conditions.role;
    this.$scope.urlParams.active = this.conditions.active;

  }

  deleteBlog(blog){
    this.submitted = true;
    this.Blog.delete( {id: blog._id},() => {
      //this.$state.go('blog');
    }, (err) => {
      this.errors.other = err.message || err;
    });
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
