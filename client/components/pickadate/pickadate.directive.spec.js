'use strict';

describe('Directive: pickadate', function () {

  // load the directive's module and view
  beforeEach(module('smartPlugApp'));
  beforeEach(module('components/pickadate/pickadate.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pickadate></pickadate>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pickadate directive');
  }));
});
