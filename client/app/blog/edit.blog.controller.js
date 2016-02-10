'use strict';

class EditBlogCtrl {
  constructor(Auth, Blog, $scope, $state, $modalInstance, blog) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Blog = Blog;
    this.$state = $state;
    this.$modalInstance = $modalInstance;
    this.origin = angular.copy(blog);
    this.blog = blog;
    this.files = [];

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });
  }

  saveBlog(form){
    this.submitted = true;
    if(form.$valid) {
      this.blog.files = this.files;
      this.$modalInstance.close(this.blog);
    }
  }

  cancelBlog(){
    this.blog.title = this.origin.title;
    this.blog.photo_url = this.origin.photo_url;
    this.blog.summary = this.origin.summary;
    this.blog.content = this.origin.content;
    this.blog.tags = this.origin.tags;

    this.$modalInstance.dismiss('cancel');
  }

  removeFile(file){
    var files = this.blog.files;
    if(files){
      this.Blog.removeFile({_id: this.blog._id, uri: file.uri}).$promise
      .then( () => {
        files.splice(files.indexOf(file), 1);
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }

  back(){
    this.$state.go('blog.list');
  }

}

angular.module('smartPlugApp')
  .controller('EditBlogCtrl', EditBlogCtrl);
