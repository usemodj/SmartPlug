'use strict';

class AdminTaxonomyCtrl {
  constructor(Auth, Taxonomy, $state, $stateParams, $http, $scope, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Taxonomy = Taxonomy;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$filter = $filter;
    this.socket = socket;
    this.taxonomies = $scope.taxonomies = [];
    this.taxonomy = {};
    this.beforeSort = '';
    this.sorted = false;

    var self = this;

    this.sortableOptions = {
      change: function(e, ui) {
        var entry = self.taxonomies.map(function(item){
          return item._id;
        }).join(',');
        self.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = self.taxonomies.map(function(item){
          return item._id;
        }).join(',');
        self.sorted = entry !== self.beforeSort;
        // IF sorted == true, updatePosition()
        if(self.sorted){
          self.updatePosition(entry);
        }
      }
    };


    this.list();
  }

  updatePosition(entry){
    this.Taxonomy.position({entry: entry}).$promise
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  list(){
    this.submitted = true;
    this.Taxonomy.query().$promise
      .then(response => {
        this.taxonomies = this.$filter('orderBy')(response, 'position', false);
        this.socket.syncUpdates('taxonomy', this.taxonomies);
      })
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  save(form){
    this.Taxonomy.save(this.taxonomy).$promise
      .catch(err => {
        this.errors.other = err.message || err.data || err;
      });
  }

  delete(taxonomy){
    this.submitted = true;
    this.Taxonomy.delete( {id: taxonomy._id}).$promise
      .catch(err => {
        this.errors.other = err.message || err.data || err;
      });
  }
}

angular.module('smartPlugApp.admin')
  .controller('AdminTaxonomyCtrl', AdminTaxonomyCtrl);

class EditTaxonomyCtrl {
  constructor(Auth, Taxonomy, $scope, $state, $stateParams, $filter, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Taxonomy = Taxonomy;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.$window = $window;
    this.socket = socket;
    this.taxonomy = {};
    var self = this;

    Taxonomy.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.taxonomy = response;
        //this.socket.syncUpdates('taxonomy', this.taxonomy);
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });
  }


  newSubItem(scope) {
    var node = scope.$modelValue;
    this.Taxonomy.objectId().$promise
    .then(objectId => {
        var child = {
          _id: objectId._id,
          name: node.name + '.' + (node.children.length + 1),
          children: []
        };
        node.children.push(child);
        scope.$childNodesScope.editing = true;

      })
    .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  editItem(scope) {
    scope.editing = true;
  }

  cancelEditingItem(scope) {
    scope.editing = false;
    if(scope.$parentNodesScope) {
      scope.$parentNodesScope.editing = false;
    }
  }

  saveItem(scope) {
    //console.log(scope)
    scope.editing = false;
    if(scope.$parentNodesScope) {
      scope.$parentNodesScope.editing = false;
    }
  }

  save(form){
    this.submitted = true;
    if(form.$valid) {
      this.saveItem(this);
      this.Taxonomy.update(this.taxonomy).$promise
        .then( response => {
          console.log(response);
          //this.taxonomy = response;
          this.success = 'Taxonomy is updated successfully!';
        })
        .catch(err => {
          console.error(err);
          this.errors.other = err.message || err.data || err;
        });
    }
  }

  cancel(){
    if(this.taxonomy && this.taxonomy.$get){
      this.taxonomy.$get();
    }
  }

  back(){
    this.$state.go('admin.products.taxonomies.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('EditTaxonomyCtrl', EditTaxonomyCtrl);
