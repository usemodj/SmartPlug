'use strict';

describe('Controller: AdminShippingMethodCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminShippingMethodCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminShippingMethodCtrl = $controller('AdminShippingMethodCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
