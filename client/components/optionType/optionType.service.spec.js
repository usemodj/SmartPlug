'use strict';

describe('Service: optionType', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var optionType;
  beforeEach(inject(function (_optionType_) {
    optionType = _optionType_;
  }));

  it('should do something', function () {
    expect(!!optionType).toBe(true);
  });

});
