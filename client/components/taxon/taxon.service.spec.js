'use strict';

describe('Service: taxon', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var taxon;
  beforeEach(inject(function (_taxon_) {
    taxon = _taxon_;
  }));

  it('should do something', function () {
    expect(!!taxon).toBe(true);
  });

});
