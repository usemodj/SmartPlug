'use strict';

import settings from '../../app/common/settings';

angular.module('smartPlugApp')
  .directive('markdownEditor', ['$window', function ($window) {
    return {
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var hiddenButtons = attrs.mdHiddenButtons ? attrs.mdHiddenButtons.split(','): [];
        $(element).markdown({
          language: settings.markdownEditor.language,
          hiddenButtons: hiddenButtons,
          additionalButtons: [
            [{
              name:'groupCustom',
              data: [{
                name: 'cmdHelp',
                toggle: true,
                title: 'Help',
                icon: 'glyphicon glyphicon-question-sign',
                callback: function(e){
                  $window.open('http://daringfireball.net/projects/markdown/syntax', '_blank');
                }
              }]

            }]
          ]
        });
      }
    };
  }]);
