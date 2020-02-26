// ============================== modules 使用 ==============================
const { src, dest, task, series, parallel, watch } = require('gulp')
const browserSync = require('browser-sync').create()
const del = require('del')
const flatten = require('gulp-flatten')
const imagemin = require('gulp-imagemin')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const glob = require('glob')

// ============================== 檔案路徑設定 ==============================
let filesPugPage = 'pug/!(layout|include)/**/*.pug'
let filesPugTemplate = 'pug/(layout|include)/**/*.pug'
let filesComponentCSS = [] // Component 的 CSS(ex: 'components/**/fontawesome/css/font-awesome.min.css', 'plugins/**/bootstrap-css/css/bootstrap.min.css')
let filesComponentAsset = [] // Component 的 Font(ex: 'components/**/fontawesome/fonts/*.*')

// ============================== Pug 轉 HTML ==============================
function pug2html(path) {
  return src(path)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(pug({
      locals: {
        dev: true,
        filesComponentCSS: (() => filesComponentCSS.map(value => glob.sync(value)[0]))() },
      pretty: true }))
      .pipe(flatten({ subPath: 1 }))
    .pipe(dest('../app_dev/'))
}
task('pug2html', () => pug2html(filesPugPage))

// ============================== 複製套件 ==============================
task('copyComponents', cb => {
  if (filesComponentCSS.concat(filesComponentAsset).length === 0) cb()
  else return src(filesComponentCSS.concat(filesComponentAsset)).pipe(dest('../app_dev/assets/components/'))
})

// ============================== 複製靜態資源 ==============================
task('copyStatic', () => src('static/**/*.*').pipe(imagemin()).pipe(dest('../app_dev/')))

// ============================== 移除資料夾 ==============================
task('deleteEverything', () => del('../app_dev/**', { force: true }))

// ============================== 開啟頁面 ==============================
task('openPage', cb => {
  browserSync.init({ ui: false, server: { baseDir: '../app_dev/' } })
  cb()
})

// ============================== 監聽檔案 ==============================
task('watchEverything', cb => {
  watch(filesPugPage).on('all', async (stats, path) => {
    await pug2html(path.replace(/\/pages\//, '/!(layout|include)/**/'))
    browserSync.reload()
  })
  watch(filesPugTemplate).on('all', async () => {
    await pug2html(filesPugPage)
    browserSync.reload()
  })
  watch(['sass/!(requires)/**/*.sass', 'js/**/*.js']).on('all', async (stats, path) => {
    await pug2html(`pug/${path.replace(/^sass/, '!(layout|include)/**').replace(/^js/, '!(layout|include)/**').replace(/.sass$/, '.pug').replace(/.js$/, '.pug')}`)
    browserSync.reload()
  })
  watch(['sass/requires/*.sass']).on('all', async () => {
    await pug2html(filesPugPage)
    browserSync.reload()
  })
  cb()
})

// ============================== 專案開發 ==============================
task('default', series('pug2html', 'watchEverything', 'openPage'))

// ============================== 專案初始化 ==============================
task('init', series('deleteEverything', parallel('copyComponents', 'copyStatic'), 'default'))