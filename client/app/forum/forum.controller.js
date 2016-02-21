'use strict';

class ForumCtrl {
  constructor(Auth, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.forums = $scope.forums = [];
    this.q = '';
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

    var tag = $stateParams.tag;
    this.q = $stateParams.q;
    if(this.q){
      $scope.url = `/api/forums/search/${this.q}`;
    }
    else if(tag){
      $scope.url = `/api/forums/tag/${tag}`;
    } else {
      $scope.url = '/api/forums';
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
    this.$window.location.href = `/forums/search/${this.q}`;
  }

}

angular.module('smartPlugApp')
  .controller('ForumCtrl', ForumCtrl);

