export default ({ app, store }) => {
  if (process.env.NODE_ENV !== 'production') { return false }
  // 安裝 Yahoo Dot Tag 程式碼
  (function (w, d, t, r, u) {
    w[u] = w[u] || []
    w[u].push({ 'projectId': '10000', 'properties': { 'pixelId': '10071263' } })
    var s = d.createElement(t)
    s.src = r
    s.async = true
    s.onload = s.onreadystatechange = function () {
      var y
      var rs = this.readyState
      var c = w[u]
      if (rs && rs !== 'complete' && rs !== 'loaded') { return }
      try {
        y = window.YAHOO.ywa.I13N.fireBeacon
        w[u] = []
        w[u].push = function (p) { y([p]) }
        y(c)
      } catch (e) { window.console.error(e) }
    }
    var scr = d.getElementsByTagName(t)[0]
    var par = scr.parentNode
    par.insertBefore(s, scr)
  })(window, document, 'script', 'https://s.yimg.com/wi/ytc.js', 'dotq')

  app.router.afterEach(() => {
  })
}
