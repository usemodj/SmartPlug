'use strict';

class NavbarController {
  //start-non-standard
  //end-non-standard

  constructor(Auth, $state, $scope) {
    this.$state = $state;
    this.$scope = $scope;

    this.menu = [{
      'title': 'Home',
      'state': 'home'
    }, {
      'title': 'Store',
      'state': 'products.list'
    }, {
      'title': 'Blog',
      'state': 'blog.list'
    }, {
      'title': 'Forum',
      'state': 'forums.list'
    }, {
      'title': 'Support',
      'state': 'supports.list'
    }];

    this.isCollapsed = true;

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    $scope.$watch('nav.isCollapsed', (newValue, oldValue) => {
      if(!newValue){
        $('#navbar-main *').click(() => {
          this.isCollapsed = true;
          $('#navbar-main').collapse('hide');
        });
      }
    }, true);
  }
}

angular.module('smartPlugApp')
  .controller('NavbarController', NavbarController);
