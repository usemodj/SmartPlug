'use strict';

class ViewBlogCtrl {
  constructor(Auth, Blog, Upload, $modal, $state, $stateParams, $scope, socket) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Blog = Blog;
    this.Upload = Upload;
    this.$modal = $modal;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.blog = {};
    this.newComment = '';
    this.progress = 0;

    this.Blog.get({id: $stateParams.id}).$promise
    .then(blog => {
      this.blog = blog;
      socket.syncUpdates('blog', this.blog.comments);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('blog');
    });
  }

  editBlog(blog){
    this.submitted = true;
    var modalInstance = this.$modal.open({
      templateUrl: 'app/blog/blog.edit.html',
      controller: EditBlogCtrl,
      controllerAs: 'vm',
      resolve: {
        blog: function(){
          return blog;
        }
      }
    });
    modalInstance.result.then((editedBlog) => {
      this.saveBlog(editedBlog);
    })
    .catch(err => {
      console.log(err);
    });
  }

  saveBlog(blog){
    delete blog.$promise;

    this.progress = 0;
    this.Upload.upload({
      url: '/api/blogs/updateBlog',
      method: 'POST',
      fields:{ blog: blog },
      file: (blog.files != null)? blog.files: null,
      fileFormatDataName: 'file'
    })
    .progress((evt) => {
      this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    })
    .success((data, status, headers, config) => {
      this.$state.go('blog.view', {id: this.$stateParams.id}, {reload: true});
    })
    .error((data, status, headers, config) => {
      this.errors.other = data;
    });
  }

  deleteBlog(blog){
    this.submitted = true;
    this.Blog.delete({id: blog._id}).$promise
    .then(() => {
        this.$state.go('blog.list');
      })
    .catch(err => {
        this.errors.other = err;
      });
  }

  addComment(){
    this.submitted = true;
    this.Blog.addComment({
      _id: this.blog._id,
      comment: this.newComment
    }).$promise
    .then( comment => {
      //console.log(comment);
      this.blog.comments.push(comment);
      this.newComment = '';
      this.$state.go('blog.view',{id: this.blog._id},{reload: true});
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
        self.Blog.saveComment({
          _id: self.blog._id,
          comment_id: comment._id,
          content: e.getContent()
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
    this.Blog.deleteComment({id: this.blog._id, comment_id: comment._id}).$promise
    .then(() => {
      this.blog.comments.splice(this.blog.comments.indexOf(comment), 1);
    })
    .catch(err => {
      this.errors.other = err;
    });
  }

  back(){
    this.$state.go('blog.list');
  }

}

angular.module('smartPlugApp')
  .controller('ViewBlogCtrl', ViewBlogCtrl);
