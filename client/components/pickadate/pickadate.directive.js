'use strict';

angular.module('smartPlugApp')
  .directive('pickadate', function ($compile, $parse) {
    return {
      restrict: 'A',
      require: 'ngModel',
      replace: true,
      transclude: 'element',
      link: function(scope, element, attrs, ngModelCtrl) {
        var modelAccessor = $parse(attrs.ngModel);

        var html = '<input type="text" class="form-control" placeholder="yyyy-mm-dd" name="'+ attrs.name + '" ng-model="'+ attrs.ngModel+ '">'
          + '<input type="hidden" name="'+ attrs.name + '_submit' + '" ng-model="'+ attrs.ngModel + '_submit'+ '">';
        var e = $compile(html)(scope);
        element.replaceWith(e);
        element = e;
        $compile(element)(scope);

        scope.$watch(modelAccessor, function (val) {
          var date = new Date(val + 'T00:00:00');
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          scope.form[attrs.name + '_submit'].$setViewValue(date);
        });

        var picker = $(element[0]).pickadate({
          format: 'yyyy-mm-dd',
          formatSubmit: 'yyyy-mm-ddT00:00:00',
          onSet: function(context) {
            var date = new Date(context.select);
            scope.form[attrs.name + '_submit'].$setViewValue(date);
            scope.form[attrs.name + '_submit'].$render();
            scope.$apply();
          }
        });
      }
    };
  });

