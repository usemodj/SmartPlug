'use strict';

angular.module('smartPlugApp', [
  'smartPlugApp.auth',
  'smartPlugApp.admin',
  'smartPlugApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'ngSanitize',
  'ngFileUpload',
  'hljs', //highlightjs
  'hc.marked', //markdown
  'bgf.paginateAnything',
  'relativeDate',
  'ui.sortable',
  'ui.select',
  'ui.tree',
  'ngClipboard',
  'angularTreeview'
  ])
  .config(['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  }])
  .config(['markedProvider', function (markedProvider) {
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      highlight: function (code, lang) {
        if (lang) {
          return hljs.highlight(lang, code, true).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });
  }])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('site', {
        abstract: true,
        url: '',
        templateUrl: 'app/layout.html'
       });
  }])
  .config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }])
  .run(['$rootScope', '$state', '$stateParams', 'Auth', function($rootScope, $state, $stateParams, Auth){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.Auth = Auth;
    $rootScope.$on('$stateChangeError',
      function (event, toState, toParams, fromState, fromParams, error) {
        console.log('$stateChangeError', event, toState, toParams, fromState, fromParams, error);
      });
  }])
  .run(['$rootScope', '$state', '$injector', function ($rootScope, $state, $injector) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var redirect = toState.redirectTo;
      if (redirect) {
        if (angular.isString(redirect)) {
          event.preventDefault();
          $state.go(redirect, toParams);
        }
        else {
          var newState = $injector.invoke(redirect, null, {toState: toState, toParams: toParams});
          if (newState) {
            if (angular.isString(newState)) {
              event.preventDefault();
              $state.go(newState);
            }
            else if (newState.state) {
              event.preventDefault();
              $state.go(newState.state, newState.params);
            }
          }
        }
      }
    });
  }]);

