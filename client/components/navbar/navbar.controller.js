'use strict';

class NavbarController {
  //start-non-standard
  //end-non-standard

  constructor(Auth, $state) {
    this.$state = $state;
    this.menu = [{
      'title': 'Home',
      'state': 'home'
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
  }
}

angular.module('smartPlugApp')
  .controller('NavbarController', NavbarController);
