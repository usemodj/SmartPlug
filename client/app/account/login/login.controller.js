'use strict';

class LoginController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $state, $window) {
    this.Auth = Auth;
    this.$state = $state;
    this.$window = $window;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('main');
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message + err.provider;
        if(err.provider){
          this.$window.location.href = '/auth/' + err.provider;
        }
      });
    }
  }
}

angular.module('smartPlugApp')
  .controller('LoginController', LoginController);
