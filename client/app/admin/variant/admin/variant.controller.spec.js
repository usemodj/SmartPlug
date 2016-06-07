'use strict';

describe('Controller: AdminVariantCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminVariantCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminVariantCtrl = $controller('AdminVariantCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
