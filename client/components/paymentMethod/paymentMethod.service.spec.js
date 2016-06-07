'use strict';

describe('Service: paymentMethod', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var paymentMethod;
  beforeEach(inject(function (_paymentMethod_) {
    paymentMethod = _paymentMethod_;
  }));

  it('should do something', function () {
    expect(!!paymentMethod).toBe(true);
  });

});
