var gulp = require('gulp'),
  watch = require('gulp-watch'),
  plumber = require('gulp-plumber'),
  notify = require("gulp-notify"),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  rename = require("gulp-rename"),
  uglify = require('gulp-uglify'),
  connect = require('gulp-connect'),
  gutil = require('gulp-util'),
  flatten = require('gulp-flatten'),
  copy = require('gulp-copy')
  del = require('del');
  // usemin = require('gulp-usemin'),
  // rev = require('gulp-rev');
var rebuildSass = false;
var rebuildNumber = 0;
var host = 'http://edenyeh.ngrok.io/'; // 測試用
var appId = '438786936303896'; // 測試用

var filesSass = [
    'sass/*.sass',
    'sass/**/!(include|require)/*.sass'], // Sass 檔案
  filesCSS = filesSass.map(function(file){return file.replace('sass', 'tmp').replace('.sass', '.css');}),
  filesComponentCSS = [], // Component 的 CSS(ex: 'components/fontawesome/css/font-awesome.min.css')
  filesComponentFont = [], // Component 的 Font(ex: 'components/fontawesome/**/fonts/*.*')
  filesCSSMinify = filesComponentCSS.concat(filesCSS),
  filesJavascript = [
    'javascript/common.js'], // 自己寫的 JavaScript
  filesComponentJavascript = [
    'components/jquery/dist/jquery.min.js'], // Component 的 JavaScript
  filesComponentJavascriptMap = [
    'components/jquery/dist/jquery.min.map'], // Component 的 JavaScript Map
  filesJavascriptMinify = filesComponentJavascript.concat(['tmp/script.uglify.js']),
  filesAssets = [
    'images/**/*.*',
    'plugins/**/*.*'], // 純粹複製
  filesRootAssets = [
    'humans.txt',
    'robots.txt',
    'favicon.ico',
    'favicon.png'
  ], // 純粹複製
  fileHtml5shiv = [
    'components/html5shiv/dist/html5shiv-printshiv.min.js'], // 舊瀏覽器支援 HTML5 Tag (手動複製檔案)
  fileHtml5shiv_prod = [
    'javascripts/html5shiv-printshiv.min.js']; // 舊瀏覽器支援 HTML5 Tag (Production 路徑, 手動複製檔案)

// =============== 整體自動化 Start ===============
gulp.task('html:init', function() {
  jade2html('./jade/partial/**/*.jade');
});
gulp.task('html:pretty', ['del:prod'], function() {
  gulp.src('./jade/partial/**/*.jade')
    .pipe(jade({
      locals: {
        host: host,
        appId: appId,
        fileHtml5shiv_prod: fileHtml5shiv_prod
      },
      pretty: true
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('../app_prod/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('html:pretty @ ' + new Date()));
    }));
});

// Sass 樣式
gulp.task('sass:init', function() {
  return sass2css(filesSass);
});
gulp.task('sass:rebuild', function() {
  rebuildSass = true;
  return sass2css(filesSass);
});
gulp.task('sass:compressed', function() {
  return gulp.src(filesSass)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({
      outputStyle: 'compressed',
      sourceMap: false
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./tmp/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('sass:compressed @ ' + new Date()));
    }));
});

// Concat 串連
// CSS
gulp.task('css:init', ['sass:init'], function() {
  return concat2style();
});
gulp.task('css:rebuild', ['sass:rebuild'], function() {
  concat2style();
});
gulp.task('css:changed', function() {
  if (rebuildSass === false) {
    concat2style();
  } else {
    rebuildNumber++;
    if (rebuildNumber === filesCSS.length) {
      rebuildNumber = 0;
      rebuildSass = false;
      concat2style();
    };
  };
});
// JS
gulp.task('js', function() {
  gulp.src(filesJavascript)
    .pipe(concat('script.js'))
    .pipe(gulp.dest('../app_dev/assets/javascripts/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('js:init @ ' + new Date()));
    }));
});
gulp.task('js:rebuild', function() {
  gulp.src(filesJavascript)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('../app_dev/assets/javascripts/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('js:init @ ' + new Date()));
    }));
});
// Minify
gulp.task('concat:css-minify', ['del:prod', 'sass:compressed'], function() {
  gulp.src(filesCSSMinify)
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('../app_prod/assets/stylesheets/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('concat:css-minify @ ' + new Date()));
    }));
});
gulp.task('concat:js-minify', ['del:prod', 'uglify'], function() {
  gulp.src(filesJavascriptMinify)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('script.min.js'))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('../app_prod/assets/javascripts/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('concat:js-minify @ ' + new Date()));
    }));
});

// Uglify JavaScript 壓縮
gulp.task('uglify', function() {
  return gulp.src('../app_dev/assets/javascripts/script.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.uglify'
    }))
    .pipe(gulp.dest('./tmp/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('uglify @ ' + new Date()));
    }));
});

// 複製 Components
gulp.task('copy:components', function() {
  return gulp.src(filesComponentJavascript.concat(filesComponentJavascriptMap).concat(filesComponentCSS).concat(filesComponentFont))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(copy('../app_dev/assets/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('copy:components @ ' + new Date()));
    }));
});
gulp.task('copy:components-prod-font', ['del:prod'], function() {
  return gulp.src(filesComponentFont)
    .pipe(flatten({includeParents: 1}))
    .pipe(gulp.dest('../app_prod/assets/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('copy:components-prod-font @ ' + new Date()));
    }));
});

// 複製 Images...
gulp.task('copy:dev', function() {
  return gulp.src(['images/**/*.*', 'fake_files/**/*.*'])
    .pipe(copy('../app_dev/assets/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('copy:dev @ ' + new Date()));
    }));
});
gulp.task('copy:assets-root', function() {
  return gulp.src(filesRootAssets)
    .pipe(copy('../app_dev/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('copy:assets-root @ ' + new Date()));
    }));
});
gulp.task('copy:assets-dev', function() {
  return gulp.src(filesAssets.splice(filesAssets.indexOf('images/**/*.*'), 1))
    .pipe(copy('../app_dev/assets/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('copy:assets-dev @ ' + new Date()));
    }));
});
gulp.task('copy:assets-prod', ['del:prod'], function() {
  return gulp.src(filesAssets.concat(filesRootAssets))
    .pipe(copy('../app_prod/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('copy:assets-prod @ ' + new Date()));
    }));
});

// 移除資料夾
gulp.task('del:dev', function() {
  return del(['./tmp/**', '../app_dev/**'], {force: true});
});
gulp.task('del:prod', function() {
  return del('../app_prod/**', {force: true});
});

// 版本號替換（完全由前端開發時可用）
// gulp.task('usemin', ['copy:assets-prod', 'copy:components-prod-font', 'html:pretty', 'concat:css-minify', 'concat:js-minify'], function() {
//  gulp.src('../app_dev/*.html')
//     .pipe(usemin({
//       css: [rev()],
//       js: [rev()]
//     }))
//    .pipe(gulp.dest('../app_dev/'));
// });
// =============== 整體自動化 End ===============

// =============== 轉譯函式 Start ===============
function jade2html(param) {
  gulp.src(param)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(jade({
      locals: {
        dev: true,
        host: host,
        appId: appId,
        fileHtml5shiv: fileHtml5shiv,
        filesComponentCSS: filesComponentCSS,
        filesComponentJavascript: filesComponentJavascript
      },
      pretty: true
    }))
    .pipe(gulp.dest('../app_dev/'))
      .on('finish', function() {
        gulp.src(param)
          .pipe(connect.reload())
          .pipe(gutil.buffer(function(err, files) {
            gutil.log(gutil.colors.yellow('jade2html @ ' + new Date()));
          }))
      });
};

function sass2css(param) {
  var index;
  var newPath;
  if (param.length === 1) {
    // sass 異動時
    param = param[0];
    index = param.indexOf('app_src/');
    newPath = param.substring(index).replace('app_src', '.').replace('/sass', '/sass/**');
  } else {
    // sass 初始化
    newPath = param;
  };

  return gulp.src(newPath)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceMap: true
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./tmp/'))
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('sass2css @ ' + new Date()));
    }));
};

function concat2style() {
  return gulp.src(filesCSS)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../app_dev/assets/stylesheets/'))
    .pipe(connect.reload())
    .pipe(gutil.buffer(function(err, files) {
      gutil.log(gutil.colors.yellow('concat2style @ ' + new Date()));
    }));
};
// =============== 轉譯函式 End ===============

// 起動 Server
gulp.task('connect:dev', function() {
  return connect.server({
    root: '../app_dev/',
    port: 8000,
    host: '0.0.0.0',
    livereload: true
  });
});
gulp.task('connect:prod', ['del:prod'], function() {
  return connect.server({
    root: '../app_prod/',
    port: 8000,
    host: '0.0.0.0',
    livereload: true
  });
});

gulp.task('default', ['copy:assets-root', 'copy:assets-dev', 'copy:components', 'html:init', 'css:init', 'js', 'connect:dev'], function() {
  watch('./jade/partial/*.jade', function(e) {
    jade2html(e.history);
  });
  watch(['./jade/layout.jade', './jade/include/*.jade'], function(e) {
    jade2html('./jade/partial/*.jade');
  });
  watch(filesSass, function(e) {
    sass2css(e.history);
  });
  watch(['./sass/require/*.sass', './sass/include/*.sass'], function(e) {
    gulp.start(['css:rebuild']);
  });
  watch('./tmp/**/*.css', function(e) {
    gulp.start(['css:changed']);
  });
  watch('./javascript/*.js', function(e) {
    gulp.start(['js:rebuild']);
  });
});
gulp.task('prod', ['copy:assets-prod', 'copy:components-prod-font', 'html:pretty', 'concat:css-minify', 'concat:js-minify', 'connect:prod']);
// gulp.task('prod', ['usemin', 'connect']);
