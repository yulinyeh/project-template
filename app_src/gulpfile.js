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
let filesPugPage = 'pug/@(pages)/**/*.pug'
let filesPugTemplate = 'pug/@(layout)/**/*.pug'
let filesSassTemplate = 'sass/@(requires)/**/*.sass'
let includeSassPage = 'sass/!(requires)/**/*.sass'
let includeJavascriptPage = 'js/**/*.js'
let filesComponentCSS = [] // Component 的 CSS(ex: 'components/**/fontawesome/css/font-awesome.min.css', 'plugins/**/bootstrap-css/css/bootstrap.min.css')
let filesComponentAsset = [] // Component 的 Font(ex: 'components/**/fontawesome/fonts/*.*')

// ============================== Pug 轉 HTML ==============================
async function pug2html(path) {
  return src(path)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      pug({
        locals: {
          dev: true,
          filesComponentCSS: (() =>
            filesComponentCSS.map(value => glob.sync(value)[0]))()
        },
        pretty: true
      })
    )
    .pipe(flatten({ subPath: 1 }))
    .pipe(dest('../app_dev/'))
}
task('pug2html', () => pug2html(filesPugPage))

// ============================== 複製套件 ==============================
task('copyComponents', cb => {
  if (filesComponentCSS.concat(filesComponentAsset).length === 0) cb()
  else
    return src(filesComponentCSS.concat(filesComponentAsset)).pipe(
      dest('../app_dev/assets/components/')
    )
})

// ============================== 複製靜態資源 ==============================
task('copyStatic', () =>
  src('static/**/*.*')
    .pipe(imagemin())
    .pipe(dest('../app_dev/'))
)

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
    await pug2html(path.replace(/\/pages\//, '/@(pages)/**/'))
    browserSync.reload()
  })
  watch(filesPugTemplate).on('all', async () => {
    await pug2html(filesPugPage)
    browserSync.reload()
  })
  watch(filesSassTemplate).on('all', async () => {
    await pug2html(filesPugPage)
    browserSync.reload()
  })
  watch(includeSassPage).on('all', async (stats, path) => {
    await pug2html(
      `pug/${path.replace(/^sass/, '@(pages)/**').replace(/.sass$/, '.pug')}`
    )
    browserSync.reload()
  })
  watch(includeJavascriptPage).on('all', async (stats, path) => {
    await pug2html(
      `pug/${path.replace(/^js/, '@(pages)/**').replace(/.js$/, '.pug')}`
    )
    browserSync.reload()
  })
  cb()
})

// ============================== 專案開發 ==============================
task('default', series('pug2html', 'watchEverything', 'openPage'))

// ============================== 專案初始化 ==============================
task(
  'init',
  series(
    'deleteEverything',
    parallel('copyComponents', 'copyStatic'),
    'default'
  )
)
