'use strict';

class NavbarController {
  //start-non-standard
  //end-non-standard

  constructor(Auth) {
    this.menu = [{
      'title': 'Home',
      'state': 'main'
    }];

    this.isCollapsed = true;

    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('smartPlugApp')
  .controller('NavbarController', NavbarController);
