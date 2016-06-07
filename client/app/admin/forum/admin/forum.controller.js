'use strict';

class AdminForumCtrl {
  constructor(Auth, $uibModal, $state, $stateParams, $scope, $http,  $location, $window, $filter, socket, Modal) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.$uibModal = $uibModal;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$location = $location;
    this.$window = $window;
    this.$scope = $scope;
    this.$filter = $filter;
    $scope.forums = [];
    this.forum = {};
    this.q = '';
    $scope.beforeSort = ''; //before sort entry
    $scope.sortEntry = ''; //sorted entry of ids
    $scope.sorted = false;

    $scope.sortableOptions = {
      change: function(e, ui) {
        var entry = $scope.forums.map(function(item){
          return item._id;
        }).join(',');
        $scope.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = $scope.forums.map(function(item){
          return item._id;
        }).join(',');
        $scope.sorted = entry != $scope.beforeSort;
        $scope.sortEntry = entry;
        // IF sorted == true, updatePosition()
        //if(sorted){
        //  this.updatePositions();
        //}
      }
    };

    $http.get('/api/admin/forums')
    .then(response => {
      $scope.forums = this.$filter('orderBy')(response.data, ['position', '-created_at']);
      socket.syncUpdates('forum', $scope.forums);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('forum');
    });

    this.delete = Modal.confirm.delete(forum => {
      $http.delete(`/api/admin/forums/${forum._id}`)
      .then( () => {
          $scope.forums.splice($scope.forums.indexOf(forum), 1);
        });
    })
  }

  search(form){
    this.submitted = true;
    this.$window.location.href = `/admin/forums/search/${this.q}`;
  }

  updatePositions(){
    this.$http.put('/api/admin/forums/updatePositions', {entry: this.$scope.sortEntry})
    .then(response => {
        //console.log(response)
        this.$scope.sorted = false;
        this.$scope.forums = this.$filter('orderBy')(response.data, ['position', '-created_at']);
        this.success = 'Positions updated.';
      })
    .catch(err => {
        console.error(err);
        this.errors.other = err.message || err;
      });
  }

  addForum(){
    this.submitted = true;
    var self = this;
    var modalInstance = this.$uibModal.open({
      templateUrl: 'app/admin/forum/admin/forum.new.html',
      controller: AdminNewForumCtrl,
      controllerAs: 'vm',
      resolve: {
        forum: function(){
          return self.forum;
        }
      }
    });
    modalInstance.result.then((edited) => {
      this.saveForum(edited);
    })
    .catch(err => {
      console.log(err);
    });
  }

  saveForum(forum){
    delete forum.$promise;
    forum.position = 0;
    this.$http.post('/api/admin/forums', forum)
    .then( response => {
        //tetthis.$scope.forums.unshift(response.data);
    })
    .catch(err => {
        console.error(err);
        this.errors.other = err.message || err;
    });
  }

  editForum(forum){
    this.submitted = true;
    var modalInstance = this.$uibModal.open({
      templateUrl: 'app/admin/forum/admin/forum.edit.html',
      controller: AdminEditForumCtrl,
      controllerAs: 'vm',
      resolve: {
        forum: function(){
          return forum;
        }
      }
    });
    modalInstance.result.then((edited) => {
      this.updateForum(edited);
    })
      .catch(err => {
        console.log(err);
      });
  }

  updateForum(forum){
    delete forum.$promise;
    forum.position = 0;
    this.$http.put(`/api/admin/forums/${forum._id}`, forum)
      .then(() => {
        //this.$scope.forums.unshift(forum);
        this.success = 'Forum is updated.';
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err;
      });
  }

  deleteForum(forum){
    this.submitted = true;
    this.$http.delete(`/api/admin/forums/${forum._id}`)
      .then(() => {
        this.$state.go('admin.forums.list');
      })
      .catch(err => {
        this.errors.other = err;
      });
  }

}
angular.module('smartPlugApp.admin')
  .controller('AdminForumCtrl', AdminForumCtrl);

class AdminNewForumCtrl {
  constructor(Auth, $scope, $state, $uibModalInstance) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.$state = $state;
    this.$uibModalInstance = $uibModalInstance;
    this.forum = { active: true};
  }

  saveForum(form){
    this.submitted = true;
    if(form.$valid) {
      this.$uibModalInstance.close(this.forum);
    }
  }

  cancelEdit(){
    this.$uibModalInstance.dismiss('cancel');
  }

  back(){
    this.$state.go('admin.forums.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('AdminNewForumCtrl', AdminNewForumCtrl);

class AdminEditForumCtrl {
  constructor(Auth, $scope, $state, $uibModalInstance, forum) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.$state = $state;
    this.$uibModalInstance = $uibModalInstance;
    this.origin = angular.copy(forum);
    this.forum = forum;
  }

  saveForum(form){
    this.submitted = true;
    if(form.$valid) {
      this.$uibModalInstance.close(this.forum);
    }
  }

  cancelEdit(){
    this.forum.name = this.origin.name;
    this.forum.info = this.origin.info;
    this.forum.active = this.origin.active;
    this.forum.locked = this.origin.locked;

    this.$uibModalInstance.dismiss('cancel');
  }

  back(){
    this.$state.go('admin.forums.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('AdminEditForumCtrl', AdminEditForumCtrl);

class AdminSearchForumCtrl{
  constructor($scope, $location, $window, $stateParams){
    this.$scope = $scope;
    this.$location = $location;
    this.$window = $window;
    this.$stateParams = $stateParams;
    this.submitted = false;
    this.posts = [];

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

    this.q = $stateParams.q;
    if(this.q){
      $scope.url = `/api/forums/search/${this.q}`;
    } else {
      $scope.url = '/api/forums/posts/recent';
    }

    $scope.$on('$destroy', function() {
      //socket.unsyncUpdates('forum');
    });

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      //socket.syncUpdates('forum', $scope.forums);
    });

  }

  search(form){
    this.submitted = true;
    this.$window.location.href = `/admin/forums/search/${this.q}`;
  }

}
angular.module('smartPlugApp.admin')
  .controller('AdminSearchForumCtrl', AdminSearchForumCtrl);
