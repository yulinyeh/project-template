<template lang="pug">
  .layout-default(@click="closeEverything($event)")
    .network-status(:class="{ 'is-offline': isOffline }")
      app-header
      shopping-list
      //- ref="nuxt" 要保留，有 js 會用到此資源
      nuxt(ref="nuxt")
      app-footer(:angel="{ name: 'Sachiel', color: '#0a3735' }")
      .loading-mask(v-show="isDataLoading")
      transition(name="v-delay")
        toast-popup(key="toast-popup", v-if="toastPayload.description")
      transition
        dialog-popup(key="dialog-popup", v-if="(dialogPayload.title || dialogPayload.description) && typeof dialogPayload.confirmCallback === 'function'")
    on-air-light(:class="{ 'is-offline': isOffline }")
</template>

<script>
  import AppHeader from '../../../common-elements/components/app-header.vue'
  import AppFooter from '../../../common-elements/components/app-footer.vue'
  import DialogPopup from '../../../common-elements/components/popups/dialog-popup.vue'
  import ToastPopup from '../../../common-elements/components/popups/toast-popup.vue'
  import OnAirLight from '../../../common-elements/components/on-air-light.vue'
  import ShoppingList from '../../../common-elements/components/shopping-list.vue'
  export default {
    name: 'LayoutsDefault',
    components: {
      AppHeader,
      AppFooter,
      DialogPopup,
      ToastPopup,
      OnAirLight,
      ShoppingList
    },
    data () {
      return {
        ...require('../../../common-elements/assets/js/layouts/default/data'),
      }
    },
    beforeMount () {
      require('../../../common-elements/assets/js/layouts/default/before-mount').init(this)
      this.initToken()
    },
    mounted () {
      require('../../../common-elements/assets/js/layouts/default/mounted').init(this)
    },
    destroyed () {
      require('../../../common-elements/assets/js/layouts/default/destroyed').init(this)
    },
    methods: {
      ...require('../../../common-elements/assets/js/layouts/default/methods')
    }
  }
</script>

<style lang="sass" scoped src="@/assets/sass/layouts/default.sass" />
