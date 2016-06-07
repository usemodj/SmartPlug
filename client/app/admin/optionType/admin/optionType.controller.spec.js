'use strict';

describe('Controller: AdminOptionTypeCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminOptionTypeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminOptionTypeCtrl = $controller('AdminOptionTypeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
