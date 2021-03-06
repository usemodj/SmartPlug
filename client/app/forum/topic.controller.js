'use strict';

var TopicCtrl = class TopicCtrl {
  constructor(Auth, $state, $stateParams, $http, $scope, $location, $window, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$scope = $scope;
    this.$window = $window;
    this.topics = $scope.topics = [];
    this.sticky_topics = $scope.sticky_topics = [];
    this.forum = $scope.forum = {};
    this.q = '';

    $scope.perPage = parseInt($location.search().perPage, 10) || 10;
    $scope.page = parseInt($location.search().page, 10) || 0;
    $scope.clientLimit = 250;

    $scope.$watch('page', function(page) { $location.search('page', page); });
    $scope.$watch('perPage', function(page) { $location.search('perPage', page); });
    $scope.$on('$locationChangeSuccess', function() {
      var page = +$location.search().page,
        perPage = +$location.search().perPage;
      if(page >= 0) { $scope.page = page; }
      if(perPage >= 0) { $scope.perPage = perPage; }
    });

    $scope.urlParams = {
      clientLimit: $scope.clientLimit,
      forum_id: $stateParams.forum_id
    };
    $scope.transformResponse = function(response){
      $scope.forum = response.forum;
      $scope.sticky_topics = response.sticky_topics;
      $scope.topics = response.topics;
    };

    var tag = $stateParams.tag;
    this.q = $stateParams.q;
    if(this.q){
      $scope.url = `/api/forums/search/${this.q}`;
    }
    else if(tag){
      $scope.url = `/api/topics/tag/${tag}`;
    } else {
      $scope.url = '/api/topics';
    }

    $scope.$on('$destroy', function() {
      //socket.unsyncUpdates('topic');
    });

    $scope.$on('pagination:loadPage', function (event, status, config) {
      // config contains parameters of the page request
      //console.log(config.url);
      // status is the HTTP status of the result
      //console.log(status);
      //socket.syncUpdates('topic', $scope.topics);
    });
  }

  search(form){
    this.submitted = true;
    this.$window.location.href = `/forums/search/${this.q}`;
  }

  deleteTopic(topic){
    this.submitted = true;
    this.$http.delete( `/api/topics/${topic._id}`,() => {
      //this.$state.go('admin.topics');
    }, (err) => {
      this.errors.other = err.message || err;
    });
  }

};

var NewTopicCtrl = class NewTopicCtrl {
  constructor(Auth, Upload, $scope, $state, $stateParams) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Upload = Upload;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.topic = {
      sticky: false,
      active: true,
      locked: false
    };
    this.files = [];

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });
  }

  saveTopic(form){
    this.submitted = true;
    this.progress = 0;
    this.topic.forum_id = this.$stateParams.forum_id;

    if(form.$valid) {
      this.Upload.upload({
        url: '/api/topics',
        method: 'POST',
        fields: {topic: this.topic},
        file: (this.files !== null) ? this.files : null,
        fileFormatDataName: 'file'
      })
      .progress((evt) => {
        this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      })
      .success((data, status, headers, config) => {
        this.$state.go('topics.view', {forum_id: this.$stateParams.forum_id, id: data._id});
      })
      .error((data, status, headers, config) => {
        this.errors.other = data;
      });
    }
  }

  back(){
    this.$state.go('topics.list', {forum_id: this.$stateParams.forum_id});
  }

};

var EditTopicCtrl = class EditTopicCtrl {
  constructor(Auth, $scope, $http, $state, $uibModalInstance, post) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.$http = $http;
    this.$state = $state;
    this.$uibModalInstance = $uibModalInstance;
    this.origin = angular.copy(post);
    this.post = post;
    this.files = [];

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });
  }

  savePost(form){
    this.submitted = true;
    if(form.$valid) {
      this.post.files = this.files;
      this.$uibModalInstance.close(this.post);
    }
  }

  cancelEdit(){
    this.post.name = this.origin.name;
    this.post.content = this.origin.content;
    this.post.sticky = this.origin.sticky;
    this.post.locked = this.origin.locked;

    this.$uibModalInstance.dismiss('cancel');
  }

  removeFile(file){
    var files = this.post.files;
    if(files){
      this.$http.post(`/api/topics/${this.post.topic}/posts/${this.post._id}/removeFile`,{_id: this.post._id, uri: file.uri})
        .then(() => {
          files.splice(files.indexOf(file), 1);
        })
        .catch(err => {
          this.errors.other = err.message || err;
        });
    }
  }

  back(){
    this.$state.go('topics.list');
  }

};

var ViewTopicCtrl = class ViewTopicCtrl {
  constructor(Auth, Upload, $uibModal, $http, $state, $stateParams, $scope, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Upload = Upload;
    this.$uibModal = $uibModal;
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.topic = $scope.topic = {};
    this.post = {};
    this.files = [];
    this.progress = 0;

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });

    $http.get(`/api/topics/${$stateParams.id}`)
      .then(response => {
        this.topic = response.data[0] || response.data;
        //socket.syncUpdates('topic', this.topic);
      });

    $scope.$on('$destroy', function () {
      //socket.unsyncUpdates('topic');
    });
  }

  editPost(post) {
    this.submitted = true;
    post.locked = this.topic.locked;
    post.sticky = this.topic.sticky;
    post.tags = this.topic.tags;
    var modalInstance = this.$uibModal.open({
      templateUrl: 'app/forum/topic.edit.html',
      controller: EditTopicCtrl,
      controllerAs: 'vm',
      resolve: {
        post: function () {
          return post;
        }
      }
    });
    modalInstance.result.then((edited) => {
      this.savePost(edited);
    })
      .catch(err => {
        console.log(err);
      });
  }

  savePost(post) {
    delete post.$promise;
    //this.post.forum_id = this.$stateParams.forum_id;
    //this.post.topic_id = this.$stateParams.id;
    this.progress = 0;
    this.Upload.upload({
      url: `/api/topics/${post.forum}/posts/${post._id}`,
      method: 'POST',
      fields: {post: post},
      file: (post.files !== null) ? post.files : null,
      fileFormatDataName: 'file'
    })
      .progress((evt) => {
        this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      })
      .success(() => {
        this.$state.go('topics.view', {forum_id: this.$stateParams.forum_id, id: this.$stateParams.id}, {reload: true});
      })
      .error((data, status, headers, config) => {
        this.errors.other = data;
      });
  }

  deleteTopic() {
    this.submitted = true;
    this.$http.delete(`/api/topics/${this.$stateParams.id}`)
      .then(() => {
        this.$state.go('topics.list', {forum_id: this.$stateParams.forum_id});
      })
      .catch(err => {
        this.errors.other = err;
      });
  }

  deletePost(post){
    this.submitted = true;
    if(post.root) {
      this.$http.delete(`/api/topics/${post.topic}`)
        .then(() => {
          this.$state.go('topics.list', {forum_id: this.$stateParams.forum_id});
        })
        .catch(err => {
          this.errors.other = err;
        });
    } else {
      this.$http.delete(`/api/topics/${post.topic}/posts/${post._id}`)
        .then(() => {
          this.topic.posts.splice(this.topic.posts.indexOf(post), 1);
        })
        .catch(err => {
          this.errors.other = err;
        });
    }
  }

  addPost(form){
    this.submitted = true;
    this.progress = 0;
    this.post.forum_id = this.$stateParams.forum_id;
    this.post.topic_id = this.$stateParams.id;

    if(form.$valid) {
      this.Upload.upload({
        url: '/api/topics/post',
        method: 'POST',
        fields: {post: this.post},
        file: (this.files !== null) ? this.files : null,
        fileFormatDataName: 'file'
      })
        .progress((evt) => {
          this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        })
        .success((data, status, headers, config) => {
          //this.$state.go('topics.view', {forum_id: this.$stateParams.forum_id, id: data.topic});
          this.topic.posts.push(data);
          this.post = {};
          this.files = [];
        })
        .error((data, status, headers, config) => {
          this.errors.other = data;
        });
    }
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
        self.Topic.saveComment({
          _id: self.topic._id,
          comment_id: comment._id,
          content: e.getContent(),
          status: 'Request'
        }).$promise
          .then(() => {
            comment.content = e.getContent();
            var el = angular.element($('.md-editor')).parents('.panel');
            el.css( 'background-color', '#ffeeff');
            setTimeout(() => {
              el.css( 'background-color', '#ffffff' );
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
    this.Topic.deleteComment({id: this.topic._id, comment_id: comment._id}).$promise
      .then(() => {
        this.topic.comments.splice(this.topic.comments.indexOf(comment), 1);
      })
      .catch(err => {
        this.errors.other = err;
      });
  }

  back(){
    this.$state.go('topics.list');
  }

};


angular.module('smartPlugApp')
  .controller('ViewTopicCtrl', ViewTopicCtrl);

angular.module('smartPlugApp')
  .controller('NewTopicCtrl', NewTopicCtrl);

angular.module('smartPlugApp')
  .controller('TopicCtrl', TopicCtrl);

angular.module('smartPlugApp')
  .controller('EditTopicCtrl', EditTopicCtrl);
