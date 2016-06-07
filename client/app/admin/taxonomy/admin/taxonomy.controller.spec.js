'use strict';

describe('Controller: AdminTaxonomyCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminTaxonomyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminTaxonomyCtrl = $controller('AdminTaxonomyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
