'use strict';

class SupportCtrl {
  constructor(Auth, Support, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Support = Support;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.supports = $scope.supports = [];
    this.conditions = {};
    this.qsearch = '';

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
      $scope.url = `/api/supports/search/${this.qsearch}`;
    }
    else if(tag){
      $scope.url = `/api/supports/tag/${tag}`;
    } else {
      $scope.url = '/api/supports';
    }

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('support');
    });

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      socket.syncUpdates('support', $scope.supports);
    });
  }

  search(form){
    this.submitted = true;
    //this.$window.location.href = `/supports/search/${this.qsearch}`;
    this.$scope.urlParams.subject = this.conditions.subject;
    this.$scope.urlParams.status = this.conditions.status;
  }

  deleteSupport(support){
    this.submitted = true;
    this.Support.delete( {id: support._id},() => {
      //this.$state.go('admin.supports');
    }, (err) => {
      this.errors.other = err.message || err;
    });
  }

}

angular.module('smartPlugApp')
  .controller('SupportCtrl', SupportCtrl);

class ViewSupportCtrl {
  constructor(Auth, Support, Upload, $modal, $state, $stateParams, $scope, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Support = Support;
    this.Upload = Upload;
    this.$modal = $modal;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.support = {};
    this.content = '';
    this.progress = 0;

    this.Support.get({id: $stateParams.id}).$promise
      .then(support => {
        this.support = support;
        socket.syncUpdates('support', this.support.comments);
      });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('support');
    });
  }

  editSupport(){
    this.submitted = true;
    var self = this;
    var modalInstance = this.$modal.open({
      templateUrl: 'app/support/support.edit.html',
      controller: EditSupportCtrl,
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
      url: '/api/supports/updateSupport',
      method: 'POST',
      fields:{ support: support },
      file: (support.files != null)? support.files: null,
      fileFormatDataName: 'file'
    })
      .progress((evt) => {
        this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      })
      .success((data, status, headers, config) => {
        this.$state.go('supports.view', {id: this.$stateParams.id}, {reload: true});
      })
      .error((data, status, headers, config) => {
        this.errors.other = data;
      });
  }

  deleteSupport(support){
    this.submitted = true;
    this.Support.delete({id: support._id}).$promise
      .then(() => {
        this.$state.go('supports.list');
      })
      .catch(err => {
        this.errors.other = err;
      });
  }

  addComment(){
    this.submitted = true;
    this.Support.addComment({
      _id: this.support._id,
      content: this.content,
      status: 'Request'
    }).$promise
      .then( comment => {
        //console.log(comment);
        this.support.comments.unshift(comment);
        this.newComment = '';
        this.$state.go('supports.view',{id: this.support._id},{reload: true});
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
        self.Support.saveComment({
          _id: self.support._id,
          comment_id: comment._id,
          content: e.getContent(),
          status: 'Request'
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
    this.Support.deleteComment({id: this.support._id, comment_id: comment._id}).$promise
      .then(() => {
        this.support.comments.splice(this.support.comments.indexOf(comment), 1);
      })
      .catch(err => {
        this.errors.other = err;
      });
  }

  back(){
    this.$state.go('supports.list');
  }

}

angular.module('smartPlugApp')
  .controller('ViewSupportCtrl', ViewSupportCtrl);

class EditSupportCtrl {
  constructor(Auth, Support, $scope, $state, $modalInstance, support) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Support = Support;
    this.$state = $state;
    this.$modalInstance = $modalInstance;
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
      this.$modalInstance.close(this.support);
    }
  }

  cancelSupport(){
    this.support.subject = this.origin.subject;
    this.support.content = this.origin.content;
    this.support.tags = this.origin.tags;

    this.$modalInstance.dismiss('cancel');
  }

  removeFile(file){
    var files = this.support.files;
    if(files){
      this.Support.removeFile({_id: this.support._id, uri: file.uri}).$promise
        .then( () => {
          files.splice(files.indexOf(file), 1);
        })
        .catch(err => {
          this.errors.other = err.message || err;
        });
    }
  }

  back(){
    this.$state.go('supports.list');
  }

}

angular.module('smartPlugApp')
  .controller('EditSupportCtrl', EditSupportCtrl);
