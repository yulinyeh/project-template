import Velocity from 'velocity-animate'

// console.log(process.server)
// console.log(process.browser)
// console.log(process.static)
// console.log(process.env.NODE_ENV)
// nuxt.config.js 中，將此 plugin 設定為 `ssr: false` 的話，大致上不需要再另外判斷使用時機，就是只在 client 端執行
window.Velocity = window.velocity = Velocity
