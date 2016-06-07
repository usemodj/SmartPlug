'use strict';

describe('Service: variant', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var variant;
  beforeEach(inject(function (_variant_) {
    variant = _variant_;
  }));

  it('should do something', function () {
    expect(!!variant).toBe(true);
  });

});
