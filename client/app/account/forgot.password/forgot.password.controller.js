'use strict';

class ForgotPasswordCtrl {
  constructor(Auth, $stateParams){
    this.errors = {};
    this.success = {};
    this.user = {};
    this.submitted = false;
    this.Auth = Auth;
    this.$stateParams = $stateParams;

  }
  mailForgotPassword(form) {
    this.submitted = true;

    if (form.$valid) {
      var email = this.user.email;
      this.Auth.mailForgotPasswordToken(email)
        .then(() => {
            // Send mail for forgot password
            this.success.email = 'Mail is sent for resetting password successfully.';
            //form['email'].$setValidity('mongoose', true);
          })
        .catch(err => {
          //console.log(err);
          err = err.data;
          this.errors = {'email': err};
          this.success = {};
          form.email.$setValidity('mongoose', false);

         });
    }
  }

  resetPassword(form){
    this.submitted = true;
    if(form.$valid){
      this.Auth.resetPasswordByToken({
        email: this.user.email,
        password: this.user.password,
        passwordToken: this.$stateParams.token
      })
      .then(() => {
        this.success.password = 'Password reset successfully.';
        console.log('success');
      })
      .catch(err => {
        console.log(err);
        err = err.data;
        this.errors = {email: err};
        form.email.$setValidity('mongoose', false);
      });
    }
  }
}

angular.module('smartPlugApp')
  .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);
