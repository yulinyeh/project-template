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
        // 資料處理完之後，才開始處理 view(template) 的相關資料
      }
    }
  })
}

export default createStore
