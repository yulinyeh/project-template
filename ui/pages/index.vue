<template lang="pug">
  .page-index
    main.main
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
    data () {
      return {}
    },
    // asyncData (context) {
    //   // 【SSR】用於此頁面載入時更新此頁的 data 資料
    //   return { project: 'nuxt' }
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

<style lang="sass" scoped src="@/assets/sass/pages/index.sass"></style>

