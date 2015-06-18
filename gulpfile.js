var gulp = require('gulp'),
  jade = require('gulp-jade'),
  compass = require('gulp-compass'),
  concat = require('gulp-concat'),
  rename = require("gulp-rename"),
  uglify = require('gulp-uglify'),
  connect = require('gulp-connect'),
  gutil = require('gulp-util');

var filesSass2CSS = ['./Sass/body.sass', './Sass/component.sass'],
  filesCSS2One = ['./tmp/body.css', './tmp/component.css'],
  filesJavascript2One = ['./Javascript/common.js'],
  filesConcatOthersCSS = ['./Prototype/assets/stylesheets/style.css'],
  filesConcatOthersJavascript = ['./Prototype/assets/javascripts/script.uglify.js'];
  
// =============== 整體自動化 Start ===============
gulp.task('html:init', function() {
  return jade2html('./Jade/partial/*.jade');
});
gulp.task('html:pretty', function() {
  gulp.src('./Jade/partial/*.jade')
    .pipe(jade({
      locals: {},
      pretty: true
    }))
    .pipe(gulp.dest('./Prototype/'))
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('html:pretty -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
});

// Compass 樣式
gulp.task('compass:init', function() {
  return sass2css(filesSass2CSS);
});
gulp.task('compass:compressed', function() {
  return gulp.src('./Sass/*.sass')
    .pipe(compass({
      style: 'compressed',
      css: './Prototype/assets/stylesheets/',
      sass: './Sass/',
      image: './Prototype/assets/images/',
      force: true,
      raw: 'Encoding.default_external = \'utf-8\'\n'
    }))
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('compass:compressed -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
});

// Concat 串連
gulp.task('css:init', ['compass:init'], function() {
  return concat2style();
});
gulp.task('css:changed', function() {
  concat2style();
});
gulp.task('js:init', function() {
  return gulp.src(filesJavascript2One)
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./Prototype/assets/javascripts/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('js:init -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
});
gulp.task('concat:css-minify', ['compass:compressed'], function() {
  gulp.src(filesConcatOthersCSS)
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./Prototype/assets/stylesheets/'))
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('concat:css-minify -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
});
gulp.task('concat:js-minify', ['uglify'], function() {
  gulp.src(filesConcatOthersJavascript)
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('./Prototype/assets/javascripts/'))
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('concat:js-minify -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
});

// Uglify JavaScript 壓縮
gulp.task('uglify', function() {
  return gulp.src('./Prototype/assets/javascripts/script.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.uglify'
    }))
    .pipe(gulp.dest('./Prototype/assets/javascripts/'))
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('uglify -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
});
// =============== 整體自動化 End ===============

// =============== 轉譯函式 Start ===============
function jade2html(param) {
  gulp.src(param)
    .pipe(jade({
      locals: {
        dev: true
      },
      pretty: true
    }))
    .pipe(gulp.dest('./Prototype/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('jade2html -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
};

function sass2css(param) {
  return gulp.src(param)
    .pipe(compass({
      style: 'expanded',
      css: './tmp/',
      sass: './Sass/',
      image: './Prototype/assets/images/',
      sourcemap: true,
      force: true,
      raw: 'Encoding.default_external = \'utf-8\'\n'
    }))
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('sass2css -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
};

function concat2style() {
  gulp.src(filesCSS2One)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./Prototype/assets/stylesheets/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      var len = files[0].history.length;
      gutil.log(gutil.colors.yellow('concat2style -> Generated file: ' + files[0].history[len - 1] + ' @ ' + new Date()));
    }));
};
// =============== 轉譯函式 End ===============

// 起動 Server
gulp.task('connect', function() {
  return connect.server({
    root: './Prototype',
    port: 8000,
    host: '0.0.0.0',
    livereload: true
  });
});

gulp.task('default', ['html:init', 'css:init', 'js:init', 'connect'], function() {
  gulp
    .watch('./Jade/partial/*.jade')
    .on('change', function(e) {
      return jade2html(e.path);
    });
  gulp.watch('./Sass/*.sass')
    .on('change', function(e) {
      return sass2css(e.path);
    });
  gulp.watch('./tmp/*.css', ['css:changed'])
  gulp.watch('./Javascript/*.js', ['js:init']);
});
gulp.task('prod', ['html:pretty', 'concat:css-minify', 'concat:js-minify']);
