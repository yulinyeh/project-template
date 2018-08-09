// https://github.com/nuxt/nuxt.js/blob/dev/lib/common/options.js#L170
// console.log(process.env.NODE_ENV) // npm run dev: 'development', npm run build: 'production', npm run generate: 'production'
// const webpack = require('webpack')
const fbAppID = process.env.SERVER === 'prod' ? '1061200460616036' : '331606597252844'
const fbAdmins = 286133171723936
const serverHostname = {
  dev: 'http://172.18.1.82:3000',
  sit: 'http://testwebawslb.event-fundrich.com',
  uat: 'http://testsite.fundrich.com.tw',
  prod: 'https://www.fundrich.com.tw'
}
const axiosBaseURL = {
  dev: ['http://testwebapisaws.event-fundrich.com', 'http://testwebapisawslb.event-fundrich.com'], // 前為 server 內部位置, 後為 client 外部位置
  sit: ['http://testwebapisaws.event-fundrich.com', 'http://testwebapisawslb.event-fundrich.com'],
  uat: ['http://172.18.22.100:80/FRSWebApi', 'http://testapis.fundrich.com.tw'],
  prod: ['http://172.18.22.100:80/FRSWebApi', 'https://apis.fundrich.com.tw']
}
const routerBase = '/'
module.exports = {
  /*
  ** Build configuration
  */
  build: {
    // analyze: true,
    extractCSS: true,
    // vendor: ['uuid/v1'], // 會被包在 common.[hash].js 裡面
    plugins: [
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // 使用 moment without locale
      // new webpack.optimize.CommonsChunkPlugin({ // 在各 .vue 裡可視情況分類套件並載入
      //   async: 'common-in-lazy',
      //   minChunks: ({ resource } = {}) => (
      //     resource &&
      //     resource.includes('node_modules') &&
      //     (/jquery/.test(resource) || /velocity-animate/.test(resource))
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
  env: {
    nodeServer: process.env.SERVER,
    fbAppID,
    serverHostname,
    routerBase
  },
  /*
  ** Headers
  ** Common headers are already provided by @nuxtjs/pwa preset
  */
  head: {
    titleTemplate: '%s - FundRich 基富通',
    title: '',
    htmlAttrs: {
      lang: 'zh-Hant-TW',
      prefix: 'og: http://ogp.me/ns#'
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'icon', type: 'image/png', href: 'favicon.png' }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'keywords', name: 'keywords', content: '' },
      { hid: 'description', name: 'description', content: '' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'FundRich 基富通 - 網路基金銷售平台' },
      { hid: 'og:url', property: 'og:url', content: `${serverHostname[process.env.SERVER]}${routerBase}` },
      { hid: 'og:title', property: 'og:title', content: '' },
      { hid: 'og:description', property: 'og:description', content: '' },
      { hid: 'og:image', property: 'og:image', content: `${serverHostname[process.env.SERVER]}${routerBase}og.jpg` },
      { hid: 'og:image:type', property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '628' },
      { property: 'fb:app_id', content: fbAppID },
      { property: 'fb:admins', content: fbAdmins },
      { property: 'fb:pages', content: fbAdmins },
      { 'http-equiv': 'cache-control', content: 'max-age=900' } // 活動站需要時時更新，從 client 端指定沒有 cache 週期
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ba9764' },
  /*
  ** Customize app manifest
  */
  meta: {
    ogTitle: false, // 設定為 false，就不會跟頁面中的 head: { meta: [{ hid: 'og:title' }] } 資訊重複
    ogDescription: false // 設定為 false，就不會跟頁面中的 head: { meta: [{ hid: 'og:description' }] } 資訊重複
  },
  manifest: {
    start_url: `${serverHostname[process.env.SERVER]}${routerBase}?utm_source=web_app_manifest&utm_campaign=${routerBase}`,
    name: '',
    short_name: '',
    display: 'standalone',
    background_color: '#ffffff', // splash screen 背景色
    theme_color: '#ba9764', // 狀態列顏色
    orientation: 'portrait', // portrait: 直式, landscape: 橫式
    description: '',
    lang: 'zh-Hant-TW',
    publicPath: `${routerBase}_nuxt/`
    // workbox: {}
  },
  /*
  ** CSS
  */
  css: [
    'normalize.css',
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
    '@nuxtjs/axios'
    // '@nuxtjs/pwa',
    // '@/modules/tapable',
    // '@/modules/custom-loaders'
  ],
  axios: {
    baseURL: axiosBaseURL[process.env.SERVER][0],
    browserBaseURL: axiosBaseURL[process.env.SERVER][1]
  },
  /*
  ** Single page application is served under "./"
  */
  router: { base: routerBase },
  /*
  ** Customize runtime options for rendering pages
  */
  cache: {
    maxAge: 60 * 15
  },
  render: {
    // 尚無法得知此以下設定是否有效
    // bundleRenderer: {
    //   shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    // },
    http2: { push: true, shouldPush: (file, type) => type === 'script' },
    static: { maxAge: 60 * 15 },
    gzip: { threshold: 9 },
    csp: true
  },
  messages: {
    nuxtjs: 'Nuxt.js',
    server_error: '網站忙碌中',
    server_error_details: '目前網站訪客過多，請按F5重新整理或稍後再試，敬請見諒。',
    client_error: '網站忙碌中',
    client_error_details: '目前網站訪客過多，請按F5重新整理或稍後再試，敬請見諒。',
    error_404: '您所前往的頁面並不存在，請返回基富通首頁重新查詢。',
    back_to_home: '返回首頁'
  }
}
