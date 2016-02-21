'use strict';

class BlogCtrl {
  constructor(Auth, Blog, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Blog = Blog;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.blogs = $scope.blogs = [];
    this.qsearch = '';

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
      $scope.url = `/api/blogs/search/${this.qsearch}`;
    }
    else if(tag){
      $scope.url = `/api/blogs/tag/${tag}`;
      //$http.get(`/api/blogs/tag/${tag}`).then(response => {
      //  this.blogs = response.data;
      //  socket.syncUpdates('blog', this.blogs);
      //});
    } else {
      $scope.url = '/api/blogs';
      //$http.get('/api/blogs').then(response => {
      //  this.blogs = response.data;
      //  socket.syncUpdates('blog', this.blogs);
      //});
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('blog');
    });

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      socket.syncUpdates('blog', $scope.blogs);
    });
  }

  search(form){
    this.submitted = true;
    //this.$scope.url = `/api/blogs/search/${this.qsearch}`;
    this.$window.location.href = `/blog/search/${this.qsearch}`;
  }

  deleteBlog(blog){
    this.submitted = true;
    this.Blog.delete( {id: blog._id},() => {
      //this.$state.go('blog');
    }, (err) => {
      this.errors.other = err.message || err;
    });
  }
}

angular.module('smartPlugApp')
  .controller('BlogCtrl', BlogCtrl);
