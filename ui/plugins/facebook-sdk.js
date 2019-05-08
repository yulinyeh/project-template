export default ({ app }) => {
  if (process.env.NODE_ENV !== 'production') return false
  // 安裝 Facebook SDK 程式碼
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: process.env.fbAppID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v3.3'
    })
  };
  ((d, s, id) => {
    var js
    var fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) { return }
    js = d.createElement(s); js.id = id
    js.src = 'https://connect.facebook.net/zh_TW/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk');

  // 安裝 Facebook Pixel 程式碼
  ((f, b, e, v, n, t, s) => {
    if (f.fbq) return false
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  window.fbq('init', '1691931001077188') // 安裝 Facebook Pixel
  // 會監聽 History State API 事件, 送一次之後, 之後會自己送
  window.fbq('track', 'PageView') // 送出 Facebook Pixel PageView

  app.router.afterEach(() => {
    // 不會監聽 History State API 事件, 要自己發送
    if (window.FB) window.FB.AppEvents.logPageView() // 送出 Facebook SDK PageView
  })
}
