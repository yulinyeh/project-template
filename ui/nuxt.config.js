const routerBase = ''
const fbAppID = process.env.SERVER === 'prod' ? '1061200460616036' : '331606597252844'
const fbAdmins = 286133171723936
const utmCampaign = 'project_name'
const serverHostname = Object({
  dev: 'https://www.fundrich.com.tw' // 開發環境、系統集成測試（AWS）、用戶驗收測試（業演）、正式環境（竹北）、正式環境
}, require('../../common-elements/assets/js/data/server-hostname.json'))
const axiosBaseURL = Object({
  dev: ['https://www.fundrich.com.tw', 'https://www.fundrich.com.tw'] // 前為 server 內部位置, 後為 client 外部位置
}, require('../../common-elements/assets/js/data/axios-base-url.json'))
const staticURL = require('../../common-elements/assets/js/data/static-url.json')
const axiosServiceURL = Object.assign({
  serverBaseURL: axiosBaseURL[process.env.SERVER][0],
  clientBaseURL: axiosBaseURL[process.env.SERVER][1]
}, require('../../common-elements/assets/js/data/axios-service-url.json'))

module.exports = {
  mode: 'universal',

  /*
   * Create environment variables that will be shared for the client and server-side.
   */
  env: {
    routerBase,
    fbAppID,
    nodeServer: process.env.SERVER,
    serverHostname,
    staticURL,
    axios: axiosServiceURL
  },

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - FundRich 基富通',
    title: '網頁標題',
    htmlAttrs: {
      lang: 'zh-Hant-TW',
      prefix: 'og: http://ogp.me/ns#'
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${routerBase}/favicon.ico` },
      { rel: 'icon', type: 'image/png', href: `${routerBase}/favicon.png` },
      { rel: 'apple-touch-startup-image', href: `${routerBase}/launch-640x1136.png`, media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { rel: 'apple-touch-startup-image', href: `${routerBase}/launch-750x1294.png`, media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { rel: 'apple-touch-startup-image', href: `${routerBase}/launch-1242x2148.png`, media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { rel: 'apple-touch-startup-image', href: `${routerBase}/launch-1125x2436.png`, media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { rel: 'apple-touch-startup-image', href: `${routerBase}/launch-1536x2048.png`, media: '(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)' },
      { rel: 'apple-touch-startup-image', href: `${routerBase}/launch-1668x2224.png`, media: '(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)' },
      { rel: 'apple-touch-startup-image', href: `${routerBase}/launch-2048x2732.png`, media: '(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)' }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'white' },
      { hid: 'keywords', name: 'keywords', content: '基富通,買基金,折扣優惠' },
      { hid: 'description', name: 'description', content: '基富通提供股票基金、債券基金、配息基金，等超過二千多級別的基金商品！並有基金淨值、基金搜尋、基金排行、智能理財多種投資理財工具，是您定期定額、單筆基金投資的好選擇！' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'FundRich 基富通 - 網路基金銷售平台' },
      { hid: 'og:url', property: 'og:url', content: `${serverHostname[process.env.SERVER]}${routerBase || '/'}` },
      { hid: 'og:title', property: 'og:title', content: '網頁標題 - FundRich 基富通' },
      { hid: 'og:description', property: 'og:description', content: '基富通提供股票基金、債券基金、配息基金，等超過二千多級別的基金商品！並有基金淨值、基金搜尋、基金排行、智能理財多種投資理財工具，是您定期定額、單筆基金投資的好選擇！' },
      { hid: 'og:image', property: 'og:image', content: `${serverHostname[process.env.SERVER]}${routerBase}/og.jpg` },
      { hid: 'og:image:type', property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '628' },
      { property: 'fb:app_id', content: fbAppID },
      { property: 'fb:admins', content: fbAdmins },
      { property: 'fb:pages', content: fbAdmins },
      { 'http-equiv': 'cache-control', content: 'max-age=900' } // 活動站需要時時更新，從 client 端指定沒有 cache 週期
    ],
    script: [
      { hid: 'global-variable', type: 'text/javascript', innerHTML: `var MAGIC_DOMAIN = '${serverHostname[process.env.SERVER]}'; var MAGIC_DOMAIN_API = '${axiosBaseURL[process.env.SERVER][1]}';`, body: true }
    ],
    __dangerouslyDisableSanitizersByTagID: { 'global-variable': ['innerHTML'] }
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
    start_url: `${serverHostname[process.env.SERVER]}${routerBase || '/'}?utm_source=web_app_manifest&utm_campaign=${utmCampaign}`,
    name: '基富通系統名稱',
    short_name: '系統名稱',
    display: 'standalone',
    background_color: '#ffffff', // splash screen 背景色
    theme_color: '#ba9764', // 狀態列顏色
    orientation: 'portrait', // portrait: 直式, landscape: 橫式
    description: '系統化整理基富通所有基金',
    lang: 'zh-Hant-TW',
    publicPath: `${routerBase}/_nuxt`
  },

  /*
  ** Global CSS
  */
  css: ['normalize.css', '@/assets/sass/main.sass'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/mixin' },
    { src: '@/plugins/facebook-sdk', ssr: false },
    { src: '@/plugins/google-sdk', ssr: false },
    { src: '@/plugins/facebook-pixel', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    ['@nuxtjs/pwa', { workbox: false }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: axiosBaseURL[process.env.SERVER][0],
    browserBaseURL: axiosBaseURL[process.env.SERVER][1]
  },

  /*
   * Single page application is served under "./"
   */
  router: { base: routerBase },

  /*
   * Customize runtime options for rendering pages
   */
  cache: {
    maxAge: 60 * 15
  },
  render: {
    // 尚無法得知此以下設定是否有效
    // bundleRenderer: {
    //   shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    // },
    http2: { push: true, pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
      .filter(f => f.asType === 'script' && f.file === 'runtime.js')
      .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`) },
    static: { maxAge: 60 * 15 },
    compressor: { threshold: 9 },
    csp: false
  },
  messages: {
    nuxtjs: 'Nuxt.js',
    server_error: '網站忙碌中',
    server_error_details: '目前網站訪客過多，請按F5重新整理或稍後再試，敬請見諒。',
    client_error: '網站忙碌中',
    client_error_details: '目前網站訪客過多，請按F5重新整理或稍後再試，敬請見諒。',
    error_404: '您所前往的頁面並不存在，請返回基富通首頁重新查詢。',
    back_to_home: '返回首頁'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    // analyze: true,
    // optimization: { // 目前 Nuxt.js 會自己將模組綁在一起, 但如果還是想要將些許模組放到另一個檔案, 可以參照以下設定
    //   minimize: true,
    //   minimizer: [],
    //   splitChunks: {
    //     automaticNameDelimiter: '.',
    //     cacheGroups: {
    //       commons: {
    //         test: /[\\/]node_modules[\\/](velocity-animate|jquery)[\\/]/,
    //         name: 'common-in-lazy',
    //         chunks: 'all',
    //       }
    //     }
    //   }
    // },
    extend(config, ctx) {
      config.node = { fs: 'empty' }
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
