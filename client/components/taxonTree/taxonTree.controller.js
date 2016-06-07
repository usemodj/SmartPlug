'use strict';

class TaxonTreeCtrl {

  constructor(Auth, Taxon, $state, $stateParams, $scope) {
    this.errors = {};
    this.success = '';
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.Taxon = Taxon;
    this.taxonTree = [];

    $scope.$watch('taxonTree.currentNode', (newObj, oldObj) => {
      if($scope.taxonTree && angular.isObject($scope.taxonTree.currentNode)){
        var taxon = $scope.taxonTree.currentNode;
        $state.go('taxons.products', {id: taxon._id});
      }
    }, false);

    this.list();
  }

  selectNode(val){
    if(angular.isObject(val)){
      this.$state.go('taxons.products', {id: val._id});
    }
  }

  list(){
    this.Taxon.query().$promise
    .then(response => {
        //console.log(response);
        this.taxonTree = this.$scope.taxonTree = response;
      })
    .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });
  }
}

angular.module('smartPlugApp')
  .controller('TaxonTreeCtrl', TaxonTreeCtrl);
