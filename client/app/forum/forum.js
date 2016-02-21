'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('forums', {
        parent: 'site',
        abstract: true,
        url: '/forums',
        template: '<div ui-view></div>'

      })
      .state('forums.list', {
        url: '',
        templateUrl: 'app/forum/forum.html',
        controller: 'ForumCtrl',
        controllerAs: 'vm'
      })
      .state('forums.search', {
        url: '/search/:q',
        templateUrl: 'app/forum/forum.search.html',
        controller: 'ForumCtrl',
        controllerAs: 'vm'
      });


    $stateProvider
      .state('topics', {
        parent: 'forums',
        abstract: true,
        url: '/:forum_id/topics',
        template: '<div ui-view></div>'

      })
      .state('topics.list', {
        url: '',
        templateUrl: 'app/forum/topic.html',
        controller: 'TopicCtrl',
        controllerAs: 'vm'
      })
      .state('topics.tag', {
        url: '/tag/:tag',
        templateUrl: 'app/forum/topic.html',
        controller: 'TopicCtrl',
        controllerAs: 'vm'
      })
      .state('topics.new', {
        url: '/new',
        templateUrl: 'app/forum/topic.new.html',
        controller: 'NewTopicCtrl',
        controllerAs: 'vm'
      })
      .state('topics.view', {
        url: '/:id/view',
        templateUrl: 'app/forum/topic.view.html',
        controller: 'ViewTopicCtrl',
        controllerAs: 'vm'
      });
  });
