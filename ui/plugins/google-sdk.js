export default ({ app, store }) => {
  if (process.env.NODE_ENV !== 'production') { return false }
  // 安裝 Global Site Tag 程式碼
  ((i, s, o, g, r, a, m) => {
    i['GoogleAnalyticsObject'] = r
    i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }
    i[r].l = 1 * new Date()
    a = s.createElement(o)
    m = s.getElementsByTagName(o)[0]
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', 'https://www.googletagmanager.com/gtag/js?id=UA-75421763-1', 'ga');

  // 安裝 Google Tag Manager 程式碼
  ((w, d, s, l, i) => {
    w[l] = w[l] || []
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
    let f = d.getElementsByTagName(s)[0]
    let j = d.createElement(s)
    let dl = l !== 'dataLayer' ? '&l=' + l : ''
    j.async = true
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
    f.parentNode.insertBefore(j, f)
  })(window, document, 'script', 'dataLayer', 'GTM-NM7PGPM')

  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  if (store && store.state.common.userInfo && store.state.common.userInfo.BFNo) window.gtag('config', 'GA_TRACKING_ID', { user_id: store.state.common.userInfo.BFNo })

  app.router.afterEach((to) => {
    // 不會監聽 History State API 事件, 要自己發送
    window.gtag('config', 'UA-75421763-1', {
      page_title: window.document.title,
      page_location: window.location.origin + process.env.routerBase + to.path
    }) // 安裝第一個 Google Analytics 與送出 PageView
    window.gtag('config', 'AW-858679249') // 安裝 Google Adwords
    window.gtag('event', 'conversion', { 'send_to': 'AW-858679249/HTaTCMvs2n8Q0c-5mQM' }) // 送出 Google Adwords 事件
  })
}
