'use strict';

describe('Service: order', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var order;
  beforeEach(inject(function (_order_) {
    order = _order_;
  }));

  it('should do something', function () {
    expect(!!order).toBe(true);
  });

});
