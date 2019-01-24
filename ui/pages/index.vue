<template lang="pug">
main.page-index 首頁
</template>

<script>
export default {
  name: 'PagesIndex',
  head () {
    return {
      // script: this.$store.state.isIE11 ? [{ hid: 'ie11', type: 'text/javascript', charset: 'utf-8', src: 'js/polyfill.min.js' }] : []
    }
  }
}
</script>

<style lang="sass" scoped src="@/assets/sass/pages/index.sass" />
