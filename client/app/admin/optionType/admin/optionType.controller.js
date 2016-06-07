'use strict';

class AdminOptionTypeCtrl {
  constructor(Auth, OptionType, $state, $stateParams, $scope, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.OptionType = OptionType;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$filter = $filter;
    this.socket = socket;
    this.optionTypes = $scope.optionTypes = [];
    this.optionType = {};
    this.beforeSort = '';
    this.sorted = false;

    var self = this;

    this.sortableOptions = {
      change: function(e, ui) {
        var entry = self.optionTypes.map(function(item){
          return item._id;
        }).join(',');
        self.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = self.optionTypes.map(function(item){
          return item._id;
        }).join(',');
        self.sorted = entry != self.beforeSort;
        // IF sorted == true, updatePosition()
        if(self.sorted){
          self.updatePosition(entry);
        }
      }
    };

    this.list();
  }

  updatePosition(entry){
    this.OptionType.position({entry: entry}).$promise
    .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.data || err;
      });

  };

  list(){
    this.submitted = true;
    this.OptionType.query().$promise
    .then(response => {
        this.optionTypes = this.$filter('orderBy')(response, 'position', false);
        this.socket.syncUpdates('optionType', this.optionTypes);
      })
    .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  save(form){
    this.OptionType.save(this.optionType).$promise
    .then((response) => {
        this.$state.go('admin.products.optionTypes.edit', {id: response._id});
      })
    .catch(err => {
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  delete(optionType){
    this.submitted = true;
    this.OptionType.delete( {id: optionType._id}).$promise
    .catch(err => {
      this.errors.other = err.message || err.statusText || err.data || err;
    });
  }
}

angular.module('smartPlugApp.admin')
  .controller('AdminOptionTypeCtrl', AdminOptionTypeCtrl);

class EditOptionTypeCtrl {
  constructor(Auth, OptionType, $scope, $state, $stateParams, $filter) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.OptionType = OptionType;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.optionType = {};
    this.beforeSort = '';
    this.sorted = false;

    var self = this;
    this.sortableOptions = {
      change: function(e, ui) {
        var entry = self.optionType.option_values.map(function(item){
          return item._id;
        }).join(',');
        self.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = self.optionType.option_values.map(function(item){
          return item._id;
        }).join(',');
        self.sorted = entry != self.beforeSort;
      }
    };

    OptionType.get({id: $stateParams.id}).$promise
      .then(response => {
        //console.log(response);
        this.optionType = response;
        if(response.option_values){
          this.optionType.option_values = this.$filter('orderBy')(response.option_values, 'position');
        }
      })
      .catch(err => {
        console.error(err);
        this.errors.other = err.message || err.statusText || err.data || err;
      });
  }

  addOptionValue(){
    this.optionType.option_values.unshift({name: '', presentation: '', position: 0});
  }

  deleteOptionValue(value){
    this.optionType.option_values.splice(this.optionType.option_values.indexOf(value), 1);
  }

  save(form){
    var self = this;
    self.submitted = true;
    if(form.$valid) {
      self.OptionType.update(self.optionType).$promise
        .then( response => {
          self.optionType = response;
          if(response.option_values){
            self.optionType.option_values = self.$filter('orderBy')(response.option_values, 'position');
          }
          self.success = 'OptionType is updated successfully!';
        })
        .catch(err => {
          console.error(err);
          self.errors.other = err.message || err.statusText || err.data || err;
        });
    }
  }

  cancel(){
    if(this.optionType && this.optionType.$get){
      this.optionType.$get();
    }
  }

  back(){
    this.$state.go('admin.products.optionTypes.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('EditOptionTypeCtrl', EditOptionTypeCtrl);
