'use strict';

describe('Directive: markdowneditor', function () {

  // load the directive's module
  beforeEach(module('smartPlugApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<markdowneditor></markdowneditor>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the markdowneditor directive');
  }));
});
