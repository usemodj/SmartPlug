'use strict';

angular.module('smartPlugApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        redirectTo: 'blog.list'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });
  });
