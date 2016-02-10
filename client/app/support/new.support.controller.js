/**
 * Created by jinny on 16. 2. 9.
 */
class NewSupportCtrl {
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
    this.support.status = 'Request';
    if(form.$valid) {
      this.Upload.upload({
        url: '/api/supports',
        method: 'POST',
        fields: {support: this.support},
        file: (this.files != null) ? this.files : null,
        fileFormatDataName: 'file'
      })
        .progress((evt) => {
          this.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        })
        .success((data, status, headers, config) => {

          this.$state.go('supports.view', {id: data._id});
        })
        .error((data, status, headers, config) => {
          this.errors.other = data;
        });
    }
  }

  back(){
    this.$state.go('supports.list');
  }

}

angular.module('smartPlugApp')
  .controller('NewSupportCtrl', NewSupportCtrl);
