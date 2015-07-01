var gulp = require('gulp'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  rename = require("gulp-rename"),
  uglify = require('gulp-uglify'),
  connect = require('gulp-connect'),
  gutil = require('gulp-util');
  // usemin = require('gulp-usemin'),
  // rev = require('gulp-rev');
var unwatchTmp = false;

var filesSass = ['./Sass/body.sass', './Sass/component.sass'],
  filesCSS = ['./tmp/body.css', './tmp/component.css'],
  filesJavascript = ['./Javascript/common.js'],
  filesJavascriptMinify = ['./Prototype/assets/javascripts/script.uglify.js'];

// =============== 整體自動化 Start ===============
gulp.task('html:init', function() {
  jade2html('./Jade/partial/*.jade');
});
gulp.task('html:pretty', function() {
  gulp.src('./Jade/partial/*.jade')
    .pipe(jade({
      locals: {},
      pretty: true
    }))
    .pipe(gulp.dest('./Prototype/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('html:pretty @ ' + new Date()));
    }));
});

// Sass 樣式
gulp.task('sass:init', function() {
  return sass2css(filesSass);
});
gulp.task('sass:rebuild', function() {
  unwatchTmp = true;
  return sass2css(filesSass);
});
gulp.task('sass:compressed', function() {
  gulp.src('./Sass/*.sass')
    .pipe(sass({
      outputStyle: 'compressed',
      sourceMap: false
    }))
    .pipe(gulp.dest('./tmp/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('sass:compressed @ ' + new Date()));
    }));
});

// Concat 串連
gulp.task('css:init', ['sass:init'], function() {
  return concat2style();
});
gulp.task('css:rebuild', ['sass:rebuild'], function() {
  concat2style();
});
gulp.task('css:changed', function() {
  if (unwatchTmp === false) {
    concat2style();
  };
});
gulp.task('js', function() {
  gulp.src(filesJavascript)
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./Prototype/assets/javascripts/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('js:init @ ' + new Date()));
    }));
});
gulp.task('concat:css-minify', ['sass:compressed'], function() {
  gulp.src(filesCSS)
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./Prototype/assets/stylesheets/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('concat:css-minify @ ' + new Date()));
    }));
});
gulp.task('concat:js-minify', ['uglify'], function() {
  gulp.src(filesJavascriptMinify)
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('./Prototype/assets/javascripts/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('concat:js-minify @ ' + new Date()));
    }));
});

// Uglify JavaScript 壓縮
gulp.task('uglify', function() {
  gulp.src('./Prototype/assets/javascripts/script.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.uglify'
    }))
    .pipe(gulp.dest('./Prototype/assets/javascripts/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('uglify @ ' + new Date()));
    }));
});

// 版本號替換（完全由前端開發時可用）
// gulp.task('usemin', ['html:pretty', 'concat:css-minify', 'concat:js-minify'], function() {
//   gulp.src('./Prototype/*.html')
//     .pipe(usemin({
//       css: [rev()],
//       js: [rev()]
//     }))
//     .pipe(gulp.dest('./Prototype/'));
// });
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
      gutil.log(gutil.colors.yellow('jade2html @ ' + new Date()));
    }));
};

function sass2css(param) {
  return gulp.src(param)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceMap: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./tmp/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('sass2css @ ' + new Date()));
    }));
};

function concat2style() {
  return gulp.src(filesCSS)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./Prototype/assets/stylesheets/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('concat2style @ ' + new Date()));
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

gulp.task('default', ['html:init', 'css:init', 'js', 'connect'], function() {
  gulp
    .watch('./Jade/partial/*.jade')
    .on('change', function(e) {
      jade2html(e.path);
    });
  gulp
    .watch(['./Jade/layout.jade', './Jade/include/*.jade'])
    .on('change', function(e) {
      jade2html('./Jade/partial/*.jade');
    });
  gulp.watch('./Sass/*.sass')
    .on('change', function(e) {
      sass2css(e.path);
    });
  gulp.watch(['./Sass/require/*.sass', './Sass/include/*.sass'], ['css:rebuild'], function() {
    unwatchTmp = false;
  });
  gulp.watch('./tmp/*.css', ['css:changed']);
  gulp.watch('./Javascript/*.js', ['js']);
});
gulp.task('prod', ['html:pretty', 'concat:css-minify', 'concat:js-minify', 'connect']);
// gulp.task('prod', ['usemin', 'connect']);
