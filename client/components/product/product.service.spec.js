'use strict';

describe('Service: Product', function () {

  // load the service's module
  beforeEach(module('smartPlugApp.service'));

  // instantiate service
  var product;
  beforeEach(inject(function (_product_) {
    product = _product_;
  }));

  it('should do something', function () {
    expect(!!product).toBe(true);
  });

});
