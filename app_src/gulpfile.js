// ============================== modules 使用 ==============================
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var pug = require('gulp-pug');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');
var glob = require('glob');
var del = require('del');
var imagemin = require('gulp-imagemin');

// ============================== 參數設定 ==============================
var gulpRebuildSass = false;
var gulpRebuildNumber = 0;

// ============================== 檔案路徑設定 ==============================
var filesPug = [
  'pug/!(layout|include)/**/*.pug'];
var filesPugTemplate = [
  'pug/layout/**/*.pug',
  'pug/include/**/*.pug'];
var filesComponentCSS = []; // Component 的 CSS(ex: 'components/**/fontawesome/css/font-awesome.min.css', 'plugins/**/bootstrap-css/css/bootstrap.min.css')
var filesComponentAsset = []; // Component 的 Font(ex: 'components/**/fontawesome/fonts/*.*')
var filesComponentJavascript = [
  'node_modules/**/jquery/dist/jquery.min.js']; // NPM 的 JavaScript
var filesComponentJavascriptMap = [
  'node_modules/**/jquery/dist/jquery.min.map']; // NPM 的 JavaScript Map
var filesAssets = [
  'images/**/*.*']; // 純粹複製

// ============================== Pug 轉 HTML ==============================
gulp.task('pug:dev', function () {
  pug2html(filesPug);
});
function pug2html(param) {
  gulp.src(param)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
      locals: {
        dev: true,
        filesComponentCSS: function() {
          return filesComponentCSS.map(function(value, index) {
            return glob.sync(value)[0];
          });
        }(),
        filesComponentJavascript: function() {
          return filesComponentJavascript.map(function(value, index) {
            return glob.sync(value)[0];
          });
        }()
      },
      pretty: true
    }))
    .pipe(flatten())
    .pipe(gulp.dest('../app_dev/'))
    .on('finish', function () {
      gulp.src(param)
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(browserSync.get('dev').reload({ stream: true }))
        .pipe(gutil.buffer(function (err, files) {
          gutil.log(gutil.colors.yellow('pug2html @ ' + new Date()));
        }))
    });
};

// ============================== 複製 Components ==============================
gulp.task('copy:components-dev', function () {
  return gulp.src(filesComponentJavascript.concat(filesComponentJavascriptMap).concat(filesComponentCSS).concat(filesComponentAsset))
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_dev/assets/components/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:components-dev @ ' + new Date()));
    }));
});

// ============================== 複製 images 靜態資源 ==============================
gulp.task('copy:images-dev', function () {
  return gulp.src(filesAssets[0])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(imagemin())
    .pipe(gulp.dest('../app_dev/assets/images/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:images-dev @ ' + new Date()));
    }));
});

// ============================== 移除資料夾 ==============================
gulp.task('del:dev', function () {
  return del('../app_dev/**', { force: true });
});

// ============================== 起動 Server ==============================
gulp.task('connect:dev', function () {
  return browserSync.create('dev');
});

// ============================== 總結 ==============================
gulp.task('copy:dev', ['copy:components-dev', 'copy:images-dev']);
gulp.task('default', ['connect:dev', 'pug:dev'], function () {
  gulp.watch(filesPug, function (e) {
    pug2html(e.path);
  });
  gulp.watch(filesPugTemplate, function (e) {
    pug2html(filesPug);
  });
  gulp.watch(['sass/*.sass'], function (e) {
    pug2html(e.path.replace('/app_src/sass/', '/app_src/pug/pages/').replace('.sass', '.pug'));
  });
  gulp.watch(['sass/requires/*.sass'], function (e) {
    pug2html(filesPug);
  });
  browserSync.get('dev').init({
    ui: false,
    server: {
      baseDir: '../app_dev/'
    }
  });
});
// --------------- 第一次編譯 ---------------
gulp.task('init', ['del:dev'], function () {
  gulp
    .start(['copy:dev'])
    .start(['default']);
})
