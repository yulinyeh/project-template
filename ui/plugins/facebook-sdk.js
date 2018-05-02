export default ({ app, route }) => {
  if (process.env.NODE_ENV !== 'production') return false
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: process.env.fbAppID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v2.11'
    })
  };
  ((d, s, id) => {
    var js
    var fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) { return }
    js = d.createElement(s); js.id = id
    js.src = 'https://connect.facebook.net/zh_TW/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk')

  app.router.afterEach((to, from) => {
    if (window.FB) window.FB.AppEvents.logPageView() // 送出 Facebook SDK PageView
  })
}
