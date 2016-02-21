'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('blog', {
        parent: 'site',
        abstract: true,
        url: '/blog',
        template: '<div ui-view></div>'
      })
      .state('blog.list', {
        url: '',
        templateUrl: 'app/blog/blog.html',
        controller: 'BlogCtrl',
        controllerAs: 'vm'
      })
      .state('blog.search', {
        url: '/search/:qsearch',
        templateUrl: 'app/blog/blog.html',
        controller: 'BlogCtrl',
        controllerAs: 'vm'
      })
      .state('blog.tag', {
        url: '/tag/:tag',
        templateUrl: 'app/blog/blog.html',
        controller: 'BlogCtrl',
        controllerAs: 'vm'
      })
      .state('blog.new', {
        url: '/new',
        templateUrl: 'app/blog/blog.new.html',
        controller: 'NewBlogCtrl',
        controllerAs: 'vm'
      })
      .state('blog.view', {
        url: '/:id',
        templateUrl: 'app/blog/blog.view.html',
        controller: 'ViewBlogCtrl',
        controllerAs: 'vm'
      });
  });
