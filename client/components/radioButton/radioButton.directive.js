'use strict';

angular.module('smartPlugApp')
  .directive('radioButton', function ($parse,$timeout) {
    return {
      replace: false,
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModelCtrl) {
        var modelAccessor = $parse(attrs.ngModel);
        var valueAccessor = $parse(attrs.ngValue);
        var isObject = function(obj) {
          //return obj === Object(obj);
          return (typeof obj === "object" && !Array.isArray(obj) && obj !== null);
        };

        scope.$watch(valueAccessor, function (val) {
          attrs.value = val;
        });

        scope.$watch(modelAccessor, function (val) {
          var value = attrs.value;
          //console.log('>>ngModel.watch....')
          //console.log(val)
          //console.log(attrs)
          //console.log(value)
          //console.log(ngModelCtrl.$modelValue)
          //console.log(isObject(value))
          var checked = (isObject(value) && isObject(val))? (value._id == val._id): (value == val);
          element[0].checked = checked;
          scope.checked = checked;
          if(element[0].checked) {
            $(element).parent().addClass('active');
          } else {
            $(element).parent().removeClass('active');
          }
        });

        $(element).change(function () {
          scope.$apply(function () {
            if(element[0].checked)
              ngModelCtrl.$setViewValue(attrs.value);
          });
        });
      }
    };

  });
