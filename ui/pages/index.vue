<template lang="pug">
  main.page-index
</template>

<script>
  import { oneLineTrim } from 'common-tags'

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
    //   // query () { return this.$route.query } // 一層不能使用在 v-model 中，當使用者更新資料的時候，會出現 no setter 的錯誤訊息
    //   // query () { return { order: this.$route.query } } // 如果只想要一開始有自己邏輯的初始值，又不想要受限要另外寫 set/get 的話，可以多包一層 object 去避開
    // },
    head () {
      return {
        title: '',
        meta: [
          { hid: 'description', name: 'description', content: '' },
          { hid: 'og:title', property: 'og:title', content: '' },
          { hid: 'og:description', property: 'og:description', content: '' }
        ],
        bodyAttrs: {
          id: 'page-index'
        },
        script: [
          { hid: 'application/ld+json',
            type: 'application/ld+json',
            innerHTML: oneLineTrim`
              []` }
        ],
        __dangerouslyDisableSanitizers: ['script']
      }
    }
  }
</script>

<style lang="sass" scoped src="@/assets/sass/pages/index.sass">
