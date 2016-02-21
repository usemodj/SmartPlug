'use strict';

describe('Controller: ForumCtrl', function () {

  // load the controller's module
  beforeEach(module('smartPlugApp'));

  var ForumCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForumCtrl = $controller('ForumCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
