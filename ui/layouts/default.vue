<template lang="pug">
  .layout-default
    //- app-aside
    .scroll-area
      app-header
      nuxt(:nuxtChildKey="$route.fullPath")
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
    components: {
      AppHeader,
      AppFooter
    }
  }
</script>
