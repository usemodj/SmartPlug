'use strict';

angular.module('smartPlugApp')
  .directive('checkbox', function ($parse,$timeout) {
    return {
      replace: false,
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModelCtrl) {
        var modelAccessor = $parse(attrs.ngModel);

        var trueValue = true;
        var falseValue = false;

        // If defined set true value
        if(attrs.ngTrueValue !== undefined) {
          trueValue = attrs.ngTrueValue;
        }
        // If defined set false value
        if(attrs.ngFalseValue !== undefined) {
          falseValue = attrs.ngFalseValue;
        }

        scope.$watch(modelAccessor, function (val) {
          //console.log('>> $watch....')
          scope.checked = val == trueValue;
        });

        $timeout( function(){
          if(element[0].checked) {
            //console.log('>> element.checked....')
            $(element).parent().addClass('active')
          }
        }, 0);

        $(element).change(function () {
          //console.log('>>element.change....')
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(element[0].checked);
          });
        });
      }
    };
  });
