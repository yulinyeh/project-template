import Vuex from 'vuex'
import common from '../../../common-elements/store/modules/common'
import mutationsLogger from '../../../common-elements/store/plugins/mutations-logger'

const createStore = () => {
  return new Vuex.Store({
    modules: {
      common
    },
    state: {},
    getters: {},
    mutations: {
      setHostname (state, value) {
        state.hostname = value
      },
      setIE11Result (state, bool) {
        state.isIE11 = bool
      }
    },
    actions: {
      nuxtServerInit ({ commit }, { req }) {
        // nuxtServerInit is called by Nuxt.js before server-rendering every page
        commit('setHostname', process.env.serverHostname[process.env.nodeServer])
        if (req) commit('setIE11Result', req.headers['user-agent'].indexOf('Trident') >= 0)

        // Nuxt 事件紀錄
        const fs = require('fs')
        try {
          fs.appendFile(`logs/theme-fund-nuxt-${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.log`, `${Date()}    ${Date.now()}    NuxtServerInit${req ? '    ' + req.headers['user-agent'] : ''}\r\n`, err => { if (err) global.console.dir(err) })
        } catch (_error) { global.console.dir(_error) }
      }
    },
    plugins: [mutationsLogger]
  })
}
export default createStore
