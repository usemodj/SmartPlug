'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.forums', {
        abstract: true,
        parent: 'admin',
        url: '/forums',
        templateUrl: 'app/admin/forum/admin/layout.html'
      })
      .state('admin.forums.list', {
        url: '',
        templateUrl: 'app/admin/forum/admin/forum.html',
        controller: 'AdminForumCtrl',
        controllerAs: 'vm'
      })
      .state('admin.forums.search', {
        url: '/search/:q',
        templateUrl: 'app/admin/forum/admin/forum.search.html',
        controller: 'AdminSearchForumCtrl',
        controllerAs: 'vm'
      })
      .state('admin.forums.posts', {
        url: '/posts',
        templateUrl: 'app/admin/forum/admin/post.html',
        controller: 'AdminSearchForumCtrl',
        controllerAs: 'vm'
      })
      .state('admin.forums.topics', {
        abstract: true,
        parent: 'admin.forums',
        url: '/:forum_id/topics',
        template: '<div ui-view></div>'
      })
      .state('admin.forums.topics.list', {
        url: '',
        templateUrl: 'app/admin/forum/admin/forum.topics.html',
        controller: 'AdminForumTopicCtrl',
        controllerAs: 'vm'
      })
      .state('admin.forums.topics.view', {
        url: '/:id/view',
        templateUrl: 'app/admin/forum/admin/forum.topic.view.html',
        controller: 'AdminViewForumTopicCtrl',
        controllerAs: 'vm'
      });


    $stateProvider
      .state('admin.topics', {
        abstract: true,
        parent: 'admin.forums',
        url: '/topics',
        template: '<div ui-view></div>'
      })
      .state('admin.topics.tag', {
        url: '/tag/:tag',
        templateUrl: 'app/admin/forum/admin/topic.html',
        controller: 'AdminTopicCtrl',
        controllerAs: 'vm'
      })
      .state('admin.topics.list', {
        url: '',
        templateUrl: 'app/admin/forum/admin/topic.html',
        controller: 'AdminTopicCtrl',
        controllerAs: 'vm'
      })
      .state('admin.topics.view', {
        url: '/:id/view',
        templateUrl: 'app/admin/forum/admin/topic.view.html',
        controller: 'AdminViewTopicCtrl',
        controllerAs: 'vm'
      });


  });
