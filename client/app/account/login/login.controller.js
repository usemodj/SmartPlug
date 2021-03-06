'use strict';

class LoginController {
  //start-non-standard
  //end-non-standard
  constructor(Auth, $state, $window) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

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
        if(this.$state.previousState && this.$state.previousState.name) {
          this.$state.go(this.$state.previousState.name, this.$state.previousParams);
        }else {
          // Logged in, redirect to home
          this.$state.go('home');
        }
      })
      .catch(err => {
        //console.error(err);
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
