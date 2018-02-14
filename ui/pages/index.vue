<template lang="pug">
  main.page-index
    //- .ld-json(v-html="`<script type=\"application/ld+json\">${structuredData}</script>`")
</template>

<script>
  export default {
    name: 'PageIndex',
    // fetch ({ store, params }) {
    //   // 【SSR】用於此頁面載入時更新 store 的 state 資料
    //   return axios.get('http://my-api/stars')
    //   .then((res) => {
    //     store.commit('setStars', res.data)
    //   })
    // },
    // asyncData (context) {
    //   // 【SSR】用於此頁面載入時更新此頁的 data 資料
    //   return { project: 'nuxt' }
    // },
    data () {
      // 如果 $route 被更新了，會觸發 data 重新 initialization
      return {}
    },
    // computed: {
    //   // query () {
    //   //   // 一層不能使用在 v-model 中，當使用者更新資料的時候，會出現 no setter 的錯誤訊息
    //   //   return this.$route.query
    //   // }
    //   // query () {
    //   //   // 如果只想要一開始有自己邏輯的初始值，又不想要受限要另外寫 set/get 的話，可以多包一層 object 去避開，但這樣其實也與 v-model 脫鉤了
    //   //   // 目前是找到的應用場景是下拉選單會隨著 $route 跟著異動，所以需要初始值先依照 $route，之後再靠 @change 事件去更新 $route，這樣 query 會也連動著更新了
    //   //   // 還不是因為 watch $route 一開始不會被觸發，要變動一次才會
    //   //   return { order: this.$route.query }
    //   // }
    //   structuredData () {
    //     return JSON.stringify({})
    //   }
    // },
    head () {
      return {
        title: '',
        bodyAttrs: {
          id: 'page-index'
        },
        meta: [
          { hid: 'description', name: 'description', content: '' },
          { hid: 'og:title', property: 'og:title', content: '' },
          { hid: 'og:description', property: 'og:description', content: '' }
        ]
      }
    },
    mounted () {
      // if (!window.velocity) require('velocity-animate')
      // if (!window.jQuery) window.$ = window.jQuery = require('jquery')
    }
  }
</script>

<style lang="sass" scoped src="@/assets/sass/pages/index.sass">
