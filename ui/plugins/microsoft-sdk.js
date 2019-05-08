export default ({ app, store }) => {
  if (process.env.NODE_ENV !== 'production') { return false }
  // 安裝 Bing ads UET 程式碼
  (function (w, d, t, r, u) {
    var f
    var n
    var i
    w[u] = w[u] || []
    f = function () {
      var o = { ti: '25033527' }
      o.q = w[u]
      w[u] = new window.UET(o)
      w[u].push('pageLoad')
    }
    n = d.createElement(t)
    n.src = r
    n.async = 1
    n.onload = n.onreadystatechange = function () {
      var s = this.readyState
      if (s && s !== 'complete' && s !== 'loaded') { return }
      try {
        f()
        n.onload = n.onreadystatechange = null
      } catch (e) { window.console.error(e) }
    }
    i = d.getElementsByTagName(t)[0]
    i.parentNode.insertBefore(n, i)
  })(window, document, 'script', '//bat.bing.com/bat.js', 'uetq')

  app.router.afterEach(() => {
  })
}
