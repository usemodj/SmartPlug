'use strict';

class NewBlogCtrl {
  constructor(Auth, Upload, Blog, $scope, $state) {
    this.errors = {};
    this.success = '';
    this.submitted = false;
    this.Auth = Auth;
    this.Upload = Upload;
    this.Blog = Blog;
    this.$state = $state;
    this.blog = {};
    this.files = [];

    $scope.$on('fileSelected', (event, args) => {
      //console.log(args.file);
      $scope.$apply(() => this.files.push(args.file));
    });
  }

  saveBlog(form){
    this.submitted = true;
    this.progress = 0;
    if(form.$valid) {
      this.Upload.upload({
          url: '/api/blogs',
          method: 'POST',
          fields: {blog: this.blog},
          file: (this.files !== null) ? this.files : null,
          fileFormatDataName: 'file'
        })
        .progress((evt) => {
          this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        })
        .success((data, status, headers, config) => {
          //this.$state.go('blog');
          this.$state.go('blog.view', {id: data._id});
        })
        .error((data, status, headers, config) => {
          this.errors.other = data;
        });
    }
  }

  back(){
    this.$state.go('blog.list');
  }

}

angular.module('smartPlugApp')
  .controller('NewBlogCtrl', NewBlogCtrl);
