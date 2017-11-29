import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    // state: {},
    // getters: {},
    // mutations: {},
    actions: {
      nuxtServerInit ({ commit }, { req }) {
        // nuxtServerInit is called by Nuxt.js before server-rendering every page
      }
    }
  })
}

export default createStore
