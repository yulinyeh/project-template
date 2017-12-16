import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    // state: {},
    // getters: {},
    // mutations: {},
    actions: {
      nuxtServerInit ({ commit }, { req }) {
        // nuxtServerInit is called by Nuxt.js before server-rendering every page
        // nuxtServerInit: 每頁開始前都來看看這裡，可回饋 $store
        // middleware: 每頁可先行判斷的邏輯，可在裡面下載資料後再做事
        // fetch: 下載資料回饋給 $store
        // asyncData: 下載資料回饋給 data
      }
    }
  })
}

export default createStore
