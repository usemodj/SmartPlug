'use strict';

describe('Directive: jqdatepicker', function () {

  // load the directive's module
  beforeEach(module('smartPlugApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<jqdatepicker></jqdatepicker>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the jqdatepicker directive');
  }));
});
