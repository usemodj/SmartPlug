'use strict';

angular.module('smartPlugApp')
  .directive('navbar', () => ({
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'EA',
    controller: 'NavbarController',
    controllerAs: 'nav'
  }));
