'use strict';

angular.module('smartPlugApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.products.optionTypes', {
        abstract: true,
        //parent: 'admin.products',
        url: '/optionTypes',
        template: '<ui-view/>'
      })
      .state('admin.products.optionTypes.list', {
        url: '',
        templateUrl: 'app/admin/optionType/admin/optionType.html',
        controller: 'AdminOptionTypeCtrl',
        controllerAs: 'vm'
      })
      .state('admin.products.optionTypes.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/optionType/admin/optionType.edit.html',
        controller: 'EditOptionTypeCtrl',
        controllerAs: 'vm'
        //resove: {
        //  optionType: ['OptionType', '$stateParams', (OptionType, $stateParams) => {
        //    OptionType.get({id: $stateParams.id}).$promise
        //    .then(response => {
        //        return response;
        //      });
        //  }]
        //}
      });
  });
