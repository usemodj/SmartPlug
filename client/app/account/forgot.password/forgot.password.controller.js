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
      var htmlContent = settings.forgotPassword.htmlContent;
      var message = {
        // sender info
        from: settings.forgotPassword.fromMail,
        // Comma separated list of recipients
        // to: '"Receiver Name"
        // <nodemailer@disposebox.com>',
        // Subject of the message
        subject: settings.forgotPassword.subject, //
        headers: {
          'X-Laziness-level': 1000
        }
        // HTML body
        //, html: '<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'
        //    + '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>',
      };

      this.Auth.forgotPasswordToken(email)
        .then( user => {
          console.log(user.passwordToken);

          let href = `${settings.forgotPassword.url}/${encodeURIComponent(user.passwordToken)}`;
          htmlContent += `<a href="${href}">${href}</a>`;
          message.to = email;
          message.html = htmlContent;

          return this.Auth.mailForgotPassword({email, message}).$promise;
        })
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
          form['email'].$setValidity('mongoose', false);

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
        form['email'].$setValidity('mongoose', false);
      });
    }
  }
}

angular.module('smartPlugApp')
  .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);
