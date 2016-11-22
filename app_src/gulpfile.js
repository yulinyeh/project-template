// ============================== modules 使用 ==============================
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
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');
var flattenPath = require('gulp-flatten/lib/flatten-path');
var glob = require('glob');
var vinyl = require('vinyl');
var del = require('del');
// var usemin = require('gulp-usemin');
// var minifyHtml = require('gulp-minify-html');
// var rev = require('gulp-rev');

// ============================== 參數設定 ==============================
var gulpRebuildSass = false;
var gulpRebuildNumber = 0;
var siteHost = 'http://localhost:3000/'; // localhost 用
var siteAppId = '628193067351657'; // localhost 用
// var siteHost = 'https://edenyeh.github.io/project-name/'; // GitHub 用
// var siteAppId = '554563908047907'; // GitHub 用
var siteHostProd = ''; // 正式用
var siteAppIdProd = ''; // 正式用
var siteName = '';

// ============================== 檔案路徑設定 ==============================
var filesPug = [
  'pug/**/!(layout|include)/*.pug'];
var filesPugTemplate = [
  'pug/layout/*.pug',
  'pug/include/*.pug'];
var filesSass = [
  'sass/*.sass',
  'sass/**/!(include|require)/*.sass'];
var  filesCSS = filesSass.map(function (file) { return file.replace('sass', 'tmp').replace('.sass', '.css'); });
var  filesComponentCSS = [
  'components/**/normalize-css/normalize.css']; // Component 的 CSS(ex: 'components/**/fontawesome/css/font-awesome.min.css')
var  filesComponentAsset = []; // Component 的 Font(ex: 'components/**/fontawesome/**/fonts/*.*')
var  filesCSSMinify = filesComponentCSS.concat(filesCSS);
var  filesJavascript = [
  'javascript/common.js']; // 自己寫的 JavaScript
var  filesComponentJavascript = [
  'components/**/jquery/dist/jquery.min.js',
  'components/**/loadcss/src/loadCSS.js',
  'components/**/loadcss/src/cssrelpreload.js']; // Component 的 JavaScript
var  filesComponentJavascriptMap = [
  'components/**/jquery/dist/jquery.min.map']; // Component 的 JavaScript Map
var  filesJavascriptMinify = filesComponentJavascript.concat(['tmp/script.uglify.js']);
var  filesAssets = [
  'images/**/*.*',
  'plugins/**/*.*',
  'fake_files/**/*.*']; // 純粹複製
var  filesRootAssets = [
  '*.txt',
  '*.ico',
  '*.jpg',
  '*.png']; // 純粹複製
var  fileHtml5shiv = [
  'components/html5shiv/dist/html5shiv-printshiv.min.js']; // 舊瀏覽器支援 HTML5 Tag (手動複製檔案)
var  fileHtml5shiv_prod = [
  'javascripts/html5shiv-printshiv.min.js']; // 舊瀏覽器支援 HTML5 Tag (Production 路徑, 手動複製檔案)

// ============================== Jade 轉 HTML ==============================
gulp.task('html:init', function () {
  pug2html(filesPug);
});
function pug2html(param) {
  gulp.src(param)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
      locals: {
        dev: true,
        host: siteHost,
        appId: siteAppId,
        fileHtml5shiv: fileHtml5shiv,
        siteName: siteName,
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
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(browserSync.get('dev').reload({ stream: true }))
        .pipe(gutil.buffer(function (err, files) {
          gutil.log(gutil.colors.yellow('pug2html @ ' + new Date()));
        }))
    });
};
gulp.task('html:pretty', function () {
  return gulp.src(filesPug)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug({
      locals: {
        host: siteHostProd,
        appId: siteAppIdProd,
        fileHtml5shiv_prod: fileHtml5shiv_prod,
        siteName: siteName
      },
      pretty: true
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(flatten())
    .pipe(gulp.dest('../app_prod/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('html:pretty @ ' + new Date()));
    }));
});

// ============================== Sass 轉 CSS ==============================
gulp.task('sass:init', function () {
  return sass2css(filesSass);
});
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
gulp.task('sass:rebuild', function () {
  gulpRebuildSass = true;
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

// ============================== CSS 串連 ==============================
gulp.task('css:init', ['sass:init'], function () {
  return concat2style();
});
function concat2style() {
  return gulp.src(filesCSS)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('../app_dev/assets/stylesheets/'))
    .pipe(browserSync.get('dev').stream())
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('concat2style @ ' + new Date()));
    }));
};
gulp.task('css:rebuild', ['sass:rebuild'], function () {
  concat2style();
});
gulp.task('css:changed', function () {
  if (gulpRebuildSass === false) {
    concat2style();
  } else {
    gulpRebuildNumber++;
    if (gulpRebuildNumber === filesCSS.length) {
      gulpRebuildNumber = 0;
      gulpRebuildSass = false;
      concat2style();
    };
  };
});

// ============================== JS 串連 ==============================
gulp.task('js', function () {
  gulp.src(filesJavascript)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('../app_dev/assets/javascripts/'))
    .pipe(browserSync.get('dev').reload({ stream: true }))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('js @ ' + new Date()));
    }));
});

// ============================== Minify ==============================
gulp.task('concat:css-minify', ['sass:compressed'], function () {
  return gulp.src(filesCSSMinify)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('../app_prod/assets/stylesheets/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('concat:css-minify @ ' + new Date()));
    }));
});
gulp.task('concat:js-minify', ['uglify'], function () {
  return gulp.src(filesJavascriptMinify)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(concat('script.min.js'))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('../app_prod/assets/javascripts/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('concat:js-minify @ ' + new Date()));
    }));
});
gulp.task('uglify', function () {
  return gulp.src('../app_dev/assets/javascripts/script.js')
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.uglify'
    }))
    .pipe(gulp.dest('tmp/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('uglify @ ' + new Date()));
    }));
});

// ============================== 複製 Components ==============================
gulp.task('copy:components-dev', function () {
  return gulp.src(filesComponentJavascript.concat(filesComponentJavascriptMap).concat(filesComponentCSS).concat(filesComponentAsset))
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(flatten({includeParents: [1, 1]}))
    .pipe(gulp.dest('../app_dev/assets/components/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:components-dev @ ' + new Date()));
    }));
});
gulp.task('copy:components-prod', function () {
  return gulp.src(filesComponentJavascript.concat(filesComponentJavascriptMap).concat(filesComponentCSS).concat(filesComponentAsset))
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(flatten({includeParents: [1, 1]}))
    .pipe(gulp.dest('../app_prod/assets/components/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:components-prod @ ' + new Date()));
    }));
});

// ============================== 複製根目錄資源 ==============================
gulp.task('copy:roots-dev', function () {
  return gulp.src(filesRootAssets)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_dev/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:roots-dev @ ' + new Date()));
    }));
});
gulp.task('copy:roots-prod', function () {
  return gulp.src(filesRootAssets)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_prod/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:roots-prod @ ' + new Date()));
    }));
});

// ============================== 複製 images, plugins, fake_files 靜態資源 ==============================
gulp.task('copy:images-dev', function () {
  return gulp.src(filesAssets[0])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_dev/assets/images/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:images-dev @ ' + new Date()));
    }));
});
gulp.task('copy:plugins-dev', function () {
  return gulp.src(filesAssets[1])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_dev/assets/plugins/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:plugins-dev @ ' + new Date()));
    }));
});
gulp.task('copy:fake_files-dev', function () {
  return gulp.src(filesAssets[2])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../website/fake_files/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:fake_files-dev @ ' + new Date()));
    }));
});
gulp.task('copy:images-prod', function () {
  return gulp.src(filesAssets[0])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_prod/assets/images/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:images-prod @ ' + new Date()));
    }));
});
gulp.task('copy:plugins-prod', function () {
  return gulp.src(filesAssets[1])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_prod/assets/plugins/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:plugins-prod @ ' + new Date()));
    }));
});
gulp.task('copy:fake_files-prod', function () {
  return gulp.src(filesAssets[2])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(gulp.dest('../app_prod/fake_files/'))
    .pipe(gutil.buffer(function (err, files) {
      gutil.log(gutil.colors.yellow('copy:fake_files-prod @ ' + new Date()));
    }));
});

// ============================== 移除資料夾 ==============================
gulp.task('del:dev', function () {
  return del(['tmp/**', '../app_dev/**'], { force: true });
});
gulp.task('del:prod', function () {
  return del('../app_prod/**', { force: true });
});

// ============================== 起動 Server ==============================
gulp.task('connect:dev', function () {
  return browserSync.create('dev');
});
gulp.task('connect:prod', function () {
  return browserSync.create('prod');
});

// ============================== 總結 ==============================
gulp.task('copy:dev', ['copy:components-dev', 'copy:roots-dev', 'copy:images-dev', 'copy:plugins-dev', 'copy:fake_files-dev']);
gulp.task('default', ['connect:dev', 'html:init', 'css:init', 'js'], function () {
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
    gulp.start(['js']);
  });
  browserSync.get('dev').init({
    ui: false,
    server: {
      baseDir: '../app_dev/'
    }
  });
});
gulp.task('copy:prod', ['copy:components-prod', 'copy:roots-prod', 'copy:images-prod', 'copy:plugins-prod', 'copy:fake_files-prod']);
gulp.task('prod', ['del:prod'], function () {
  return gulp
    .start(['connect:prod', 'copy:prod', 'html:pretty', 'concat:css-minify', 'concat:js-minify'],
    function () {
      browserSync.get('prod').init({
        ui: false,
        server: {
          baseDir: '../app_prod/'
        }
      });
    })
});
// --------------- 第一次編譯 ---------------
gulp.task('init', ['del:dev'], function () {
  gulp
    .start(['copy:dev'])
    .start(['default']);
})

// ============================== 版本號替換（完全由前端開發時可用） ==============================
gulp.task('usemin', ['prod'], function () {
  gulp.src('../app_prod/**/*.html')
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
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