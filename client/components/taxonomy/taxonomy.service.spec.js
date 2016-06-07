'use strict';

describe('Service: taxonomy', function () {

  // load the service's module
  beforeEach(module('smartPlugApp'));

  // instantiate service
  var taxonomy;
  beforeEach(inject(function (_taxonomy_) {
    taxonomy = _taxonomy_;
  }));

  it('should do something', function () {
    expect(!!taxonomy).toBe(true);
  });

});
