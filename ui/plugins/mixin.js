import Vue from 'vue'

Vue.mixin({
  data () {
    return {}
  },
  computed: {
    ...require('../../../common-elements/assets/js/plugins/mixin/computed')
  },
  methods: {
    ...require('../../../common-elements/assets/js/plugins/mixin/methods')
  }
})
