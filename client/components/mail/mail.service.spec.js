'use strict';

describe('Service: mail', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var mail;
  beforeEach(inject(function (_mail_) {
    mail = _mail_;
  }));

  it('should do something', function () {
    expect(!!mail).toBe(true);
  });

});
