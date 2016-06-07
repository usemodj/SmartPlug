'use strict';

class AdminAssetCtrl {
  constructor(Auth, Upload, Asset, $scope, $state, $stateParams, $location, $filter, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Upload = Upload;
    this.Asset = Asset;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.$filter = $filter;
    this.socket = socket;
    this.product = {};
    this.masterVariant = {};
    this.variants = [];
    this.asset = {};
    this.files = [];
    this.copy = [];
    this.beforeSort = '';
    this.sorted = false;

    var self = this;

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });

    this.sortableOptions = {
      change: function(e, ui) {
        var entry = self.assets.map(function(item){
          return item._id;
        }).join(',');
        self.beforeSort = entry;
      },
      // called after a node is dropped
      stop: function(e, ui) {
        var entry = self.assets.map(function(item){
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
    this.Asset.position({entry: entry}).$promise
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.data || err;
      });

  };

  list(){
    this.submitted = true;
    this.Asset.list({product_id: this.$stateParams.product_id}).$promise
      .then(response => {
        console.log(response);
        this.variants = this.$filter('orderBy')(response.variants, 'position', false);
        this.assets = this.$filter('orderBy')(response.assets, 'position', false);
        if(this.assets){
          for(var i = 0; i < this.assets.length; ++i){
            this.copy.push(this.$location.protocol() + '://' + this.$location.host() + ':' + this.$location.port()
              + '/assets/upload/' + this.assets[i].uri);
          }
        }
        if(this.variants){
          this.product = this.variants[0].product;
          for(var i = 0; i < this.variants.length; ++i){
            if(this.variants[i].is_master) {
              this.masterVariant = this.variants[i];
              this.variants.splice(this.variants.indexOf(this.masterVariant), 1);
              break;
            }
          }
        }
        this.socket.syncUpdates('asset', this.assets);
      })
      .catch(err => {
        console.log(err);
        this.errors.other = err.message || err.data || err;
      });
  }

  save(form){
    this.submitted = true;
    this.progress = 0;
    if(form.$valid) {
      this.asset.product = this.$stateParams.product_id;
      if(!this.asset.variant) this.asset.variant = this.masterVariant._id;

      this.Upload.upload({
        url: '/api/assets',
        method: 'POST',
        fields: {asset: this.asset},
        file: (this.files != null) ? this.files : null,
        fileFormatDataName: 'file'
      })
      .progress((evt) => {
        this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      })
      .success((data, status, headers, config) => {
        this.$state.go('admin.products.assets.list',{product_id: this.$stateParams.product_id}, {reload:true});
      })
      .error((data, status, headers, config) => {
        this.errors.other = data;
      });
    }
  }

  delete(asset){
    this.submitted = true;
    this.Asset.delete( {id: asset._id}).$promise
      .catch(err => {
        this.errors.other = err.message || err.data || err;
      });
  }

}

angular.module('smartPlugApp.admin')
  .controller('AdminAssetCtrl', AdminAssetCtrl);
