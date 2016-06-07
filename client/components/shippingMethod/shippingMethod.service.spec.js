'use strict';

describe('Service: shippingMethod', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var shippingMethod;
  beforeEach(inject(function (_shippingMethod_) {
    shippingMethod = _shippingMethod_;
  }));

  it('should do something', function () {
    expect(!!shippingMethod).toBe(true);
  });

});
