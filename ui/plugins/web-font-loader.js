window.WebFontConfig = {
  classes: false,
  events: false,
  google: { families: ['Roboto:400,500'] },
  custom: {
    families: ['Noto Sans TC'],
    urls: ['https://fonts.googleapis.com/earlyaccess/notosanstc.css']
  }
};
((d) => {
  let wf = d.createElement('script')
  let s = d.scripts[0]
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
  wf.async = true
  s.parentNode.insertBefore(wf, s)
})(document)
