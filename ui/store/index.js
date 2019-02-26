import common from '../../../common-elements/store/modules/common'
import mutationsLogger from '../../../common-elements/store/plugins/mutations-logger'

export const modules = {
  common
}

export const state = () => ({
  featureName: 'ProjectName', // 功能名稱，用於 sitemap 超連結變色
  hostname: '', // 用於 Structured Data 的絕對路徑
  isIE11: false // 是否為 ie11
})

export const getters = {
  gtagEventCategory: (state, getters) => {
    // return (state.route.params && state.route.params.list && state.route.params.list.length > 0) ? `${process.env.routerBase}/${state.route.params.list}` : process.env.routerBase
    return process.env.routerBase
  }
}

export const mutations = {
  setHostname (state, value) {
    state.hostname = value
  },
  setIE11Result (state, bool) {
    state.isIE11 = bool
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    // nuxtServerInit is called by Nuxt.js before server-rendering every page
    commit('setHostname', process.env.serverHostname[process.env.nodeServer])
    if (req) commit('setIE11Result', req.headers['user-agent'].indexOf('Trident') >= 0)

    // Nuxt 事件紀錄
    const fs = require('fs')
    try {
      fs.appendFile(`logs/project-name-nuxt-${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.log`, `${Date()}    ${Date.now()}    NuxtServerInit${req ? '    ' + req.headers['user-agent'] : ''}\r\n`, err => { if (err) global.console.dir(err) })
    } catch (_error) { global.console.dir(_error) }
  }
}

export const plugins = [
  mutationsLogger
]
