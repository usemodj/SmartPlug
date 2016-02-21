'use strict';

describe('Controller: AdminForumCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var AdminForumCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminForumCtrl = $controller('AdminForumCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
