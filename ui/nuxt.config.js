// https://github.com/nuxt/nuxt.js/blob/dev/lib/common/options.js#L170
// console.log(process.env.NODE_ENV) // npm run dev: 'development', npm run build: 'production', npm run generate: 'production'
// const webpack = require('webpack')
const routerBase = '/'
module.exports = {
  /*
  ** Build configuration
  */
  build: {
    // analyze: true,
    extractCSS: true,
    vendor: ['uuid/v1', 'velocity-animate'], // 會被包在 common.[hash].js 裡面
    plugins: [
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // 使用 moment without locale
      // new webpack.optimize.CommonsChunkPlugin({ // 在各 .vue 裡可視情況分類套件並載入
      //   async: 'common-in-lazy',
      //   minChunks: ({ resource } = {}) => (
      //     resource &&
      //     resource.includes('node_modules') &&
      //     (/velocity-animate/.test(resource) || /jquery/.test(resource))
      //   )
      // })
    ]
  },
  /*
  ** Create environment variables that will be shared for the client and server-side.
  ** 可在此設定任何參數, 任何一處 .js 都可利用 process.env 取得設定
  ** 但要注意不可以直接在 pug 中使用, 因為 pug 是預設使用 this 中的資料
  ** 必須要先在 data 中建立參數, 再把 process.env 中的參數指定到 data 中
  */
  env: {},
  /*
  ** Headers
  ** Common headers are already provided by @nuxtjs/pwa preset
  */
  head: {
    titleTemplate: '%s - 網站名稱',
    title: '',
    htmlAttrs: {
      lang: 'zh-Hant-TW',
      prefix: 'og: http://ogp.me/ns#'
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: './favicon.ico' },
      { rel: 'icon', type: 'image/png', href: './favicon.png' }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: '' },
      { hid: 'description', name: 'description', content: '' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: '' },
      { hid: 'og:url', property: 'og:url', content: process.env.NODE_ENV === 'development' ? `http://${process.env.HOST}:${process.env.PORT}${routerBase}` : `https://${process.env.HOST}${routerBase}` },
      { hid: 'og:title', property: 'og:title', content: '' },
      { hid: 'og:description', property: 'og:description', content: '' },
      { hid: 'og:image', property: 'og:image', content: process.env.NODE_ENV === 'development' ? `http://${process.env.HOST}:${process.env.PORT}${routerBase}og.jpg` : `https://${process.env.HOST}${routerBase}og.jpg` },
      { hid: 'og:image:type', property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '628' },
      { 'http-equiv': 'cache-control', content: 'max-age=900' } // 活動站需要時時更新，從 client 端指定沒有 cache 週期
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#269384' },
  /*
  ** Customize app manifest
  */
  meta: {
    ogTitle: false, // 設定為 false，就不會跟頁面中的 head: { meta: [{ hid: 'og:title' }] } 資訊重複
    ogDescription: false // 設定為 false，就不會跟頁面中的 head: { meta: [{ hid: 'og:description' }] } 資訊重複
  },
  manifest: {
    start_url: 'http://taiwanfund.event-fundrich.com/?utm_source=web_app_manifest&utm_campaign=2017_taiwanfund_race',
    name: '創造勝利 fund 程式',
    short_name: 'fund 程式',
    background_color: '#FFF', // splash screen 背景色
    theme_color: '#269384', // 狀態列顏色
    orientation: 'portrait', // portrait: 直式, landscape: 橫式
    description: '全國大專院校基金投資模擬競賽',
    lang: 'zh-Hant-TW'
  },
  /*
  ** CSS
  */
  css: [
    'normalize.css',
    'hamburgers/dist/hamburgers.min.css',
    '@/assets/sass/main.sass'
  ],
  /*
  ** Plugins
  */
  plugins: [
    // 這裡只是註明 server 會不會用到這些 plugins, 為了省記憶體
    // 如果沒有將套件寫在 vendor 的設定裡, 就是包在各自的頁面裡
    // 除非利用 webpack.optimize.CommonsChunkPlugin, 才會再包在 common-in-lazy.[hash].js 裡
    // { src: '@/plugins/global-site-tag', ssr: false },
    // { src: '@/plugins/facebook-pixel', ssr: false },
    // { src: '@/plugins/facebook-sdk', ssr: false }
  ],
  /*
  ** Modules
  */
  modules: [
    // 自製 modules 時機：會利用到 NUXT 的 life circle, 或是想把一些邏輯當範本使用
    // '@nuxtjs/pwa',
    // '@/modules/tapable',
    // '@/modules/custom-loaders'
  ],
  /*
  ** Single page application is served under "./"
  */
  router: { base: routerBase },
  /*
  ** Customize runtime options for rendering pages
  */
  render: {
    // 尚無法得知此以下設定是否有效
    // bundleRenderer: {
    //   shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    // },
    http2: { push: true, shouldPush: (file, type) => type === 'script' },
    static: { maxAge: 60 * 15 },
    gzip: { threshold: 9 },
    csp: true
  }
}
