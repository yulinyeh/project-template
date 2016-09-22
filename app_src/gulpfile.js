var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');
var flattenPath = require('gulp-flatten/lib/flatten-path');
var glob = require('glob');
var vinyl = require('vinyl');
var del = require('del');
// var usemin = require('gulp-usemin');
// var minifyHtml = require('gulp-minify-html');
// var rev = require('gulp-rev');
var rebuildSass = false;
var rebuildNumber = 0;
var host = 'http://localhost:3000/'; // localhost 用
var appId = '628193067351657'; // localhost 用
// var host = 'https://edenyeh.github.io/project-name/'; // GitHub 用
// var appId = '554563908047907'; // GitHub 用
var hostProd = ''; // 正式用
var appIdProd = ''; // 正式用

var filesPug = [
  'pug/**/!(layout|include)/*.pug'],
  filesPugTemplate = [
    'pug/layout/*.pug',
    'pug/include/*.pug'];
var filesSass = [
  'sass/*.sass',
  'sass/**/!(include|require)/*.sass'],
  filesCSS = filesSass.map(function (file) { return file.replace('sass', 'tmp').replace('.sass', '.css'); }),
  filesComponentCSS = [
    'components/**/normalize-css/normalize.css'
  ], // Component 的 CSS(ex: 'components/**/fontawesome/css/font-awesome.min.css')
  filesComponentAsset = [], // Component 的 Font(ex: 'components/**/fontawesome/**/fonts/*.*')
  filesCSSMinify = filesComponentCSS.concat(filesCSS),
  filesJavascript = [
    'javascript/common.js'], // 自己寫的 JavaScript
  filesComponentJavascript = [
    'components/**/jquery/dist/jquery.min.js'], // Component 的 JavaScript
  filesComponentJavascriptMap = [
    'components/**/jquery/dist/jquery.min.map'], // Component 的 JavaScript Map
  filesJavascriptMinify = filesComponentJavascript.concat(['tmp/script.uglify.js']),
  filesAssets = [
    'images/**/*.*',
    'plugins/**/*.*',
    'fake_files/**/*.*'], // 純粹複製
  filesRootAssets = [
    '*.txt',
    '*.ico',
    '*.jpg',
    '*.png'
  ], // 純粹複製
  fileHtml5shiv = [
    'components/html5shiv/dist/html5shiv-printshiv.min.js'], // 舊瀏覽器支援 HTML5 Tag (手動複製檔案)
  fileHtml5shiv_prod = [
    'javascripts/html5shiv-printshiv.min.js']; // 舊瀏覽器支援 HTML5 Tag (Production 路徑, 手動複製檔案)

// =============== 整體自動化 Start ===============
gulp.task('html:init', function () {
  pug2html(filesPug);
});
gulp.task('html:pretty', ['del:prod'], function () {
  return gulp.src(filesPug)
    .pipe(pug({
      locals: {
        host: hostProd,
        appId: appIdProd,
        fileHtml5shiv_prod: fileHtml5shiv_prod
      },
      pretty: true
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('../app_prod/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('html:pretty @ ' + new Date()));
    }));
});

// Sass 樣式
gulp.task('sass:init', function () {
  return sass2css(filesSass);
});
gulp.task('sass:rebuild', function () {
  rebuildSass = true;
  return sass2css(filesSass);
});
gulp.task('sass:compressed', function () {
  return gulp.src(filesSass)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('tmp/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('sass:compressed @ ' + new Date()));
    }));
});

// Concat 串連
// CSS
gulp.task('css:init', ['sass:init'], function () {
  return concat2style();
});
gulp.task('css:rebuild', ['sass:rebuild'], function () {
  concat2style();
});
gulp.task('css:changed', function () {
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
gulp.task('js:init', function () {
  gulp.src(filesJavascript)
    .pipe(concat('script.js'))
    .pipe(gulp.dest('../app_dev/assets/javascripts/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('js:init @ ' + new Date()));
    }));
});
gulp.task('js:rebuild', function () {
  gulp.src(filesJavascript)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('../app_dev/assets/javascripts/'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('js:rebuild @ ' + new Date()));
    }));
});
// Minify
gulp.task('concat:css-minify', ['del:prod', 'sass:compressed'], function () {
  return gulp.src(filesCSSMinify)
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('../app_prod/assets/stylesheets/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('concat:css-minify @ ' + new Date()));
    }));
});
gulp.task('concat:js-minify', ['del:prod', 'uglify'], function () {
  return gulp.src(filesJavascriptMinify)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat('script.min.js'))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('../app_prod/assets/javascripts/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('concat:js-minify @ ' + new Date()));
    }));
});

// Uglify JavaScript 壓縮
gulp.task('uglify', function () {
  return gulp.src('../app_dev/assets/javascripts/script.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.uglify'
    }))
    .pipe(gulp.dest('tmp/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('uglify @ ' + new Date()));
    }));
});

// 複製 Components
gulp.task('copy:components', function () {
  return gulp.src(filesComponentJavascript.concat(filesComponentJavascriptMap).concat(filesComponentCSS).concat(filesComponentAsset))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(flatten({includeParents: [1, 1]}))
    .pipe(gulp.dest('../app_dev/assets/components/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:components @ ' + new Date()));
    }));
});
gulp.task('copy:components-prod-font', ['del:prod'], function () {
  return gulp.src(filesComponentAsset)
    .pipe(flatten({includeParents: -1}))
    .pipe(gulp.dest('../app_prod/assets/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:components-prod-font @ ' + new Date()));
    }));
});

// 複製
// ----- 開發版 -----
// 獨立任務(複製 images 資料夾)
gulp.task('copy:assets-images-dev', function () {
  return gulp.src(['images/**/*.*'])
    .pipe(gulp.dest('../app_dev/assets/images/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:assets-images-dev @ ' + new Date()));
    }));
});
// 複製根目錄資源
gulp.task('copy:root-assets-dev', function () {
  return gulp.src(filesRootAssets)
    .pipe(gulp.dest('../app_dev/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:root-assets-dev @ ' + new Date()));
    }));
});
// 複製 plugins...(除了 images) 目錄資源
gulp.task('copy:assets-dev', function () {
  var temp = filesAssets.slice();
  temp.splice(temp.indexOf('images/**/*.*'), 1);
  return gulp.src(temp)
    .pipe(gulp.dest('../app_dev/assets/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:assets-dev @ ' + new Date()));
    }));
});
// ----- 產品版 -----
// 複製 根 目錄資源
gulp.task('copy:root-assets-prod', ['del:prod'], function () {
  return gulp.src(filesRootAssets)
    .pipe(gulp.dest('../app_prod/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:root-assets-prod @ ' + new Date()));
    }));
});
// 複製 images, plugins... 目錄資源
gulp.task('copy:assets-prod', ['del:prod'], function () {
  return gulp.src(filesAssets)
    .pipe(gulp.dest('../app_prod/assets/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:assets-prod @ ' + new Date()));
    }));
});

// 移除資料夾
gulp.task('del:dev', function () {
  return del(['tmp/**', '../app_dev/**'], { force: true });
});
gulp.task('del:prod', function () {
  return del('../app_prod/**', { force: true });
});
gulp.task('del:prod-assets-min', function () {
  del([
    '../app_prod/assets/javascripts/script.min.js',
    '../app_prod/assets/stylesheets/style.min.css'], { force: true });
});

// 版本號替換（完全由前端開發時可用）
gulp.task('usemin', ['copy:root-assets-prod', 'copy:assets-prod', 'copy:components-prod-font', 'html:pretty', 'concat:css-minify', 'concat:js-minify'], function () {
  return gulp.src('../app_prod/**/*.html')
    .pipe(usemin({
      css: [rev],
      js: [rev],
      html: [function () { return minifyHtml({ empty: true }); }]
    }))
    .pipe(gulp.dest('../app_prod/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('usemin @ ' + new Date()));
    }));
});
// =============== 整體自動化 End ===============

// =============== 轉譯函式 Start ===============
function pug2html(param) {
  gulp.src(param)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
      locals: {
        dev: true,
        host: host,
        appId: appId,
        fileHtml5shiv: fileHtml5shiv,
        filesComponentCSS: function() {
          return filesComponentCSS.map(function(value, index) {
            return _path = flattenPath(new vinyl({
              path: __dirname + '/' + glob.sync(value)[0],
              relative: glob.sync(value)[0]
            }), {includeParents: [2, 1]});
          });
        }(),
        filesComponentJavascript: function() {
          return filesComponentJavascript.map(function(value, index) {
            return _path = flattenPath(new vinyl({
              path: __dirname + '/' + glob.sync(value)[0],
              relative: glob.sync(value)[0]
            }), {includeParents: [2, 1]});
          });
        }()
      },
      pretty: true
    }))
    .pipe(flatten())
    .pipe(gulp.dest('../app_dev/'))
    .on('finish', function () {
      gulp.src(param)
        .pipe(browserSync.reload({ stream: true }))
        .pipe(gutil.buffer(function (err, files) {
          gutil.log(gutil.colors.yellow('pug2html @ ' + new Date()));
        }))
    });
};

function sass2css(param) {
  var index;
  var newPath;
  if (typeof param === 'object') {
    // sass 初始化
    newPath = param;
  } else {
    // sass 異動時
    index = param.indexOf('app_src/');
    newPath = param.substring(index).replace('app_src', '.').replace('/sass', '/sass/**');
  };

  return gulp.src(newPath)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('tmp/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('sass2css @ ' + new Date()));
    }));
};

function concat2style() {
  return gulp.src(filesCSS)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../app_dev/assets/stylesheets/'))
    .pipe(browserSync.stream())
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('concat2style @ ' + new Date()));
    }));
};
// =============== 轉譯函式 End ===============

// 起動 Server
gulp.task('connect:dev', function () {
  return browserSync.init({
    server: {
      baseDir: '../app_dev/'
    }
  });
});
gulp.task('connect:prod', function () {
  return browserSync.init({
    server: {
      baseDir: '../app_prod/'
    }
  });
});

gulp.task('default', ['connect:dev', 'copy:root-assets-dev', 'copy:assets-dev', 'copy:components', 'html:init', 'css:init', 'js:init'], function () {
  gulp.watch(filesPug, function (e) {
    pug2html(e.path);
  });
  gulp.watch(filesPugTemplate, function (e) {
    pug2html(filesPug);
  });
  gulp.watch(filesSass, function (e) {
    sass2css(e.path);
  });
  gulp.watch(['sass/require/*.sass', 'sass/include/*.sass'], function (e) {
    gulp.start(['css:rebuild']);
  });
  gulp.watch('tmp/**/*.css', function (e) {
    gulp.start(['css:changed']);
  });
  gulp.watch('javascript/*.js', function (e) {
    gulp.start(['js:rebuild']);
  });
});
gulp.task('prod', ['copy:root-assets-prod', 'copy:assets-prod', 'copy:components-prod-font', 'html:pretty', 'concat:css-minify', 'concat:js-minify'], function () {
  gulp.start(['connect:prod']);
});
// gulp.task('prod', ['usemin'], function() {
//   gulp.start(['connect:prod']);
// });
