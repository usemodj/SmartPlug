'use strict';

angular.module('smartPlugApp.auth', [
  'smartPlugApp.constants',
  'smartPlugApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
