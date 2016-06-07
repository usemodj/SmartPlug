'use strict';

describe('Controller: AdminPaymentMethodCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminPaymentMethodCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminPaymentMethodCtrl = $controller('AdminPaymentMethodCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
