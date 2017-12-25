<template lang="pug">
  .layout-default
    app-header
    .clear
      app-aside.left
      nuxt.left(:nuxtChildKey="routerViewKey")
    app-footer
</template>

<script>
  import AppHeader from '~/components/app-header.vue'
  import AppFooter from '~/components/app-footer.vue'

  export default {
    name: 'LayoutDefault',
    head () {
      return {
        titleTemplate: '%s - 網站名稱'
      }
    },
    computed: {
      routerViewKey () {
        // 用來決定是否替換 nuxt 中所有的 dom，如果是用 $route.fullPath 的話，網址有稍稍異動，就會重新整理 dom
        // 或是用類似
        // this.$route.query.list ? this.$route.query.list : ''
        // 的方式， list 這個變數有異動，才更新
        return this.$route.query.list ? this.$route.query.list : ''
      }
    },
    components: {
      AppHeader,
      AppFooter
    }
  }
</script>
