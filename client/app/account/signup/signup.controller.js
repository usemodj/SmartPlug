'use strict';

class SignupController {
  //start-non-standard
  //end-non-standard

  constructor(Auth, $state) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
        name: this.user.name,
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
        err = err.data;
        this.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });
      });
    }
  }
}

angular.module('smartPlugApp')
  .controller('SignupController', SignupController);
