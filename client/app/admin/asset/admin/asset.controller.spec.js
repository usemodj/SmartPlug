'use strict';

describe('Controller: AdminAssetCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminAssetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminAssetCtrl = $controller('AdminAssetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
