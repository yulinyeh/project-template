<template lang="pug">
  .page-index
    main.main
</template>

<script>
  import { oneLineTrim } from 'common-tags'

  export default {
    name: 'PageIndex',
    data () {
      return {}
    },
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

