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
  'hc.marked',
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
          //
          //  Core highlighting function. Accepts a language name, or an alias, and a
          //  string with the code to highlight. Returns an object with the following
          //  properties:
          //  - relevance (int)
          //  - value (an HTML string with highlighting markup)
          //
          //  function highlight(name, value, ignore_illegals, continuation)
          return hljs.highlight(lang, code, true).value;
        } else {
          //
          //   Highlighting with language detection. Accepts a string with the code to
          //   highlight. Returns an object with the following properties:
          //   - language (detected language)
          //   - relevance (int)
          //   - value (an HTML string with highlighting markup)
          //   - second_best (object with the same structure for second-best heuristically
          //     detected language, may be absent)
          //
          //   function highlightAuto(text, languageSubset)
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
    ngClipProvider.setPath('bower_components/zeroclipboard/dist/ZeroClipboard.swf');
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
  .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

  }])
  .run(['$rootScope', '$state', '$injector','Auth', function ($rootScope, $state, $injector, Auth) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
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

      var requiresLogin = toState.authenticate;
      if(requiresLogin && !Auth.isLoggedIn()){
        event.preventDefault();
        $state.go('login');
      }

      if(toState.name === 'login'){
        $state.previousState = fromState;
        $state.previousParams = fromParams;
      }
    });
  }]);
