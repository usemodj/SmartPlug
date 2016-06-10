'use strict';

class AdminSupportCtrl {
  constructor(Auth, AdminSupport, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.AdminSupport = AdminSupport;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.supports = [];
    this.conditions = {};
    this.qsearch = '';
    var self = this;

    $scope.perPage = parseInt($location.search().perPage, 10) || 10;
    $scope.page = parseInt($location.search().page, 10) || 0;
    $scope.clientLimit = 250;

    $scope.$watch('page', function(page) { $location.search('page', page); });
    $scope.$watch('perPage', function(page) { $location.search('perPage', page); });
    $scope.$on('$locationChangeSuccess', function() {
      var page = +$location.search().page,
        perPage = +$location.search().perPage;
      if(page >= 0) { $scope.page = page; };
      if(perPage >= 0) { $scope.perPage = perPage; };
    });

    $scope.urlParams = {
      clientLimit: $scope.clientLimit
    };

    var tag = $stateParams.tag;
    this.qsearch = $stateParams.qsearch;
    if(this.qsearch){
      $scope.url = `/api/admin/supports/search/${this.qsearch}`;
    }
    else if(tag){
      $scope.url = `/api/admin/supports/tag/${tag}`;
    } else {
      $scope.url = '/api/admin/supports';
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('support');
    });

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      socket.syncUpdates('support', self.supports);
    });
  }

  search(form){
    this.submitted = true;
    //this.$scope.url = `/api/blogs/search/${this.qsearch}`;
    //this.$window.location.href = `/admin/supports/search/${this.qsearch}`;
    this.$scope.urlParams.subject = this.conditions.subject;
    this.$scope.urlParams.status = this.conditions.status;
  }

  deleteSupport(support){
    this.submitted = true;
    this.AdminSupport.delete( {id: support._id},() => {
      //this.$state.go('admin.supports');
    }, (err) => {
      this.errors.other = err.message || err;
    });
  }

}

angular.module('smartPlugApp.admin')
  .controller('AdminSupportCtrl', AdminSupportCtrl);

class AdminNewSupportCtrl {
  constructor(Auth, Upload, $scope, $state) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Upload = Upload;
    this.$state = $state;
    this.support = {};
    this.files = [];

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });
  }

  saveSupport(form){
    this.submitted = true;
    this.progress = 0;
    if(form.$valid) {
      this.Upload.upload({
        url: '/api/admin/supports',
        method: 'POST',
        fields: {support: this.support},
        file: (this.files != null) ? this.files : null,
        fileFormatDataName: 'file'
      })
        .progress((evt) => {
          this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        })
        .success((data, status, headers, config) => {
          this.$state.go('admin.supports.view', {id: data._id});
        })
        .error((data, status, headers, config) => {
          this.errors.other = data;
        });
    }
  }

  back(){
    this.$state.go('admin.supports.list');
  }
}

angular.module('smartPlugApp.admin')
  .controller('AdminNewSupportCtrl', AdminNewSupportCtrl);

class AdminViewSupportCtrl {
  constructor(Auth, AdminSupport, Upload, $uibModal, $state, $stateParams, $scope, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.AdminSupport = AdminSupport;
    this.Upload = Upload;
    this.$uibModal = $uibModal;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.support = {};
    this.content = '';
    this.progress = 0;

    this.AdminSupport.get({id: $stateParams.id}).$promise
      .then(support => {
        this.support = support;
      });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('support');
    });
  }

  editSupport(){
    this.submitted = true;
    var self = this;
    var modalInstance = this.$uibModal.open({
      templateUrl: 'app/admin/support/support.edit.html',
      controller: AdminEditSupportCtrl,
      controllerAs: 'vm',
      resolve: {
        support: function(){
          return self.support;
        }
      }
    });
    modalInstance.result.then((editedSupport) => {
      this.saveSupport(editedSupport);
    })
      .catch(err => {
        console.log(err);
      });
  }

  saveSupport(support){
    delete support.$promise;

    this.progress = 0;
    this.Upload.upload({
      url: '/api/admin/supports/updateSupport',
      method: 'POST',
      fields:{ support: support },
      file: (support.files != null)? support.files: null,
      fileFormatDataName: 'file'
    })
      .progress((evt) => {
        this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      })
      .success((data, status, headers, config) => {
        this.$state.go('admin.supports.view', {id: this.$stateParams.id}, {reload: true});
      })
      .error((data, status, headers, config) => {
        this.errors.other = data;
      });
  }

  deleteSupport(support){
    this.submitted = true;
    this.AdminSupport.delete({id: support._id}).$promise
      .then(() => {
        this.$state.go('admin.supports.list');
      })
      .catch(err => {
        this.errors.other = err.statusText || err;
      });
  }

  close(){
    this.AdminSupport.close({id: this.$stateParams.id}).$promise
    .then(() => {
        this.$state.go('admin.supports.list');
      })
      .catch(err => {
        this.errors.other = err.statusText || err;
      });
  }

  addComment(){
    this.submitted = true;
    this.AdminSupport.addComment({
      _id: this.support._id,
      content: this.content,
      status: 'Feedback'
    }).$promise
      .then( comment => {
        //console.log(comment);
        this.support.comments.unshift(comment);
        this.newComment = '';
        this.$state.go('admin.supports.view',{_id: this.support._id},{reload: true});
      })
      .catch(err => {
        this.errors.other = err;
      })
  }

  editComment(comment){
    var self = this;
    var editor = angular.element($(`#${comment._id}`));
    editor.markdown({autofocus: true, savable: true, hideable:true,
      onShow: function(e) {
        e.setContent( comment.content);
      },
      onSave: function(e) {//e: markdown editor
        //alert("Saving '" + e.getContent() + "'...");
        self.AdminSupport.saveComment({
          _id: self.support._id,
          comment_id: comment._id,
          content: e.getContent(),
          status: 'Feedback'
        }).$promise
          .then(() => {
            comment.content = e.getContent();
            var el = angular.element($('.md-editor')).parents('.panel');
            el.css( "background-color", "#ffeeff" );
            setTimeout(() => {
              el.css( "background-color", "#ffffff" );
            }, 2000);
            e.blur();
          })
          .catch(err => {
            self.errors.other = err;
          });
      }
    });
  }

  deleteComment(comment){
    this.AdminSupport.deleteComment({id: this.support._id, comment_id: comment._id}).$promise
      .then(() => {
        this.support.comments.splice(this.support.comments.indexOf(comment), 1);
      })
      .catch(err => {
        this.errors.other = err;
      });
  }

  back(){
    this.$state.go('admin.supports.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('AdminViewSupportCtrl', AdminViewSupportCtrl);

class AdminEditSupportCtrl {
  constructor(Auth, AdminSupport, $scope, $state, $uibModalInstance, support) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.AdminSupport = AdminSupport;
    this.$state = $state;
    this.$uibModalInstance = $uibModalInstance;
    this.origin = angular.copy(support);
    this.support = support;
    this.files = [];

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });
  }

  saveSupport(form){
    this.submitted = true;
    if(form.$valid) {
      this.support.files = this.files;
      this.$uibModalInstance.close(this.support);
    }
  }

  cancelSupport(){
    this.support.subject = this.origin.subject;
    this.support.content = this.origin.content;
    this.support.tags = this.origin.tags;

    this.$uibModalInstance.dismiss('cancel');
  }

  removeFile(file){
    var files = this.support.files;
    if(files){
      this.AdminSupport.removeFile({_id: this.support._id, uri: file.uri}).$promise
        .then( () => {
          files.splice(files.indexOf(file), 1);
        })
        .catch(err => {
          this.errors.other = err.message || err;
        });
    }
  }

  back(){
    this.$state.go('admin.supports.list');
  }

}

angular.module('smartPlugApp.admin')
  .controller('AdminEditSupportCtrl', AdminEditSupportCtrl);
