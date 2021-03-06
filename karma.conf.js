// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/tether/dist/js/tether.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/lodash/lodash.js',
      'client/bower_components/angular-socket-io/socket.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/angular-validation-match/dist/angular-validation-match.min.js',
      'client/bower_components/showdown/dist/showdown.js',
      'client/bower_components/angular-markdown-filter/markdown.js',
      'client/bower_components/angular-highlightjs/build/angular-highlightjs.js',
      'client/bower_components/marked/lib/marked.js',
      'client/bower_components/angular-marked/dist/angular-marked.js',
      'client/bower_components/highlightjs/highlight.pack.js',
      'client/bower_components/angular-paginate-anything/dist/paginate-anything-tpls.js',
      'client/bower_components/jquery-ui/jquery-ui.js',
      'client/bower_components/angular-ui-sortable/sortable.js',
      'client/bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'client/bower_components/zeroclipboard/dist/ZeroClipboard.js',
      'client/bower_components/ng-clip/src/ngClip.js',
      'client/bower_components/pickadate/lib/picker.js',
      'client/bower_components/pickadate/lib/picker.date.js',
      'client/bower_components/pickadate/lib/picker.time.js',
      'client/bower_components/angular-ui-select/dist/select.js',
      'client/bower_components/angular.treeview/angular.treeview.js',
      'client/bower_components/angular-bootstrap-checkbox/angular-bootstrap-checkbox.js',
      'client/bower_components/bootstrap-markdown/js/bootstrap-markdown.js',
      'client/bower_components/ng-file-upload/ng-file-upload.js',
      'client/bower_components/popper.js/dist/umd/popper.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'node_modules/socket.io-client/socket.io.js',
      'client/app/app.js',
      'client/{app,components}/**/*.module.js',
      'client/{app,components}/**/*.js',
      'client/{app,components}/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'ng-html2js',
      'client/{app,components}/**/*.js': 'babel'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline',
        optional: [
          'es7.classProperties'
        ]
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // reporter types:
    // - dots
    // - progress (default)
    // - spec (karma-spec-reporter)
    // - junit
    // - growl
    // - coverage
    reporters: ['spec'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
