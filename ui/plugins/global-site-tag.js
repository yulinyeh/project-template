export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') return false
  ((i, s, o, g, r, a, m) => {
    i['GoogleAnalyticsObject'] = r
    i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }
    i[r].l = 1 * new Date()
    a = s.createElement(o)
    m = s.getElementsByTagName(o)[0]
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.googletagmanager.com/gtag/js?id=UA-75421763-13', 'ga')
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())

  app.router.afterEach((to, from) => {
    // window.gtag('config', 'UA-75421763-13') // 安裝第一個 Google Analytics 與送出 PageView
    // window.gtag('config', 'UA-75421763-1') // 安裝第二個 Google Analytics 與送出 PageView
    // window.gtag('config', 'AW-858679249') // 安裝 Google Adwords
    // window.gtag('event', 'conversion', { 'send_to': 'AW-858679249/-STTCPaxg3sQ0c-5mQM' }) // 送出 Google Adwords 事件
  })
}
