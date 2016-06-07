'use strict';

describe('Controller: AdminProductCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminProductCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminProductCtrl = $controller('AdminProductCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
