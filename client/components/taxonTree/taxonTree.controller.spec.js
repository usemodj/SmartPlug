'use strict';

describe('Controller: TaxonTreeCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var TaxonTreeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaxonTreeCtrl = $controller('TaxonTreeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
