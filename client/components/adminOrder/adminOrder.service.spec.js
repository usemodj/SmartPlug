'use strict';

describe('Service: adminOrder', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var adminOrder;
  beforeEach(inject(function (_adminOrder_) {
    adminOrder = _adminOrder_;
  }));

  it('should do something', function () {
    expect(!!adminOrder).toBe(true);
  });

});
