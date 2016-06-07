'use strict';

angular.module('smartPlugApp')
  .directive('jqdatepicker', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        $(element).datepicker({
          dateFormat: 'yy-mm-dd',
          onSelect: function(date) {
            ngModelCtrl.$setViewValue(date);
            ngModelCtrl.$render();
            scope.$apply();
          }
        });

        //var picker = $(element).pickadate({
        //  format: 'yyyy-mm-dd',
        //  formatSubmit: 'yyyy-mm-ddT00:00:00',
        //  onSet: function(context) {
        //    //console.log(new Dcontext.select)
        //    //console.log(picker.get('select'));
        //    //console.log(picker.get('select', 'yyyy-mm-ddT00:00:00'));
        //    //console.log(scope)
        //  }
        //});
      }
    };
  });
