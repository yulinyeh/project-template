<template lang="pug">
main.page-index
  auto-complete.mobile-component
</template>

<script>
import AutoComplete from '../../../common-elements/components/auto-complete.vue'
import axios from '../../../common-elements/assets/js/plugins/axios.js'
export default {
  name: 'PagesIndex',
  components: {
    AutoComplete
  },
  async fetch ({ store, error }) {
    if (process.server) {
      let apiPrefix = process.env.nodeServer === 'uat' || process.env.nodeServer === 'prod' ? '/FrsWebApi' : ''
      apiPrefix = process.env.nodeServer === 'dev' ? process.env.axios.serverBaseURL + '/FrsWebApi/Common' : apiPrefix
      await axios.all([
        axios.get(apiPrefix + process.env.axios.getTrending)
      ]).then(axios.spread((_trending) => {
        if (_trending.data && typeof _trending.data === 'object') {
          // ==================================== 熱門關鍵字資料 ====================================
          store.commit('common/setTrendings', _trending.data.result)
        } else {
          // Nuxt 事件紀錄
          const fs = require('fs')
          try {
            fs.appendFile(`logs/homepage-nuxt-${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.log`, `${Date()}    ${Date.now()}    FetchFail${req ? '    ' + req.headers['user-agent'] : ''}    無法取得熱門關鍵字資料：格式錯誤或不存在    路徑：${route.fullPath}\r\n`, err => { if (err) global.console.dir(err) })
          } catch (_error) { global.console.dir(_error) }
          // 進入錯誤顯示頁面
          return error({ statusCode: 404, message: '無法取得熱門關鍵字資料：格式錯誤或不存在' })
        }
      })).catch(_err => {
        // Nuxt 事件紀錄
        const fs = require('fs')
        if (_err.response && _err.response.data && _err.response.data.Message) {
          try {
            fs.appendFile(`logs/homepage-nuxt-${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.log`, `${Date()}    ${Date.now()}    FetchError${req ? '    ' + req.headers['user-agent'] : ''}    ${_err.response.data.Message}    路徑：${route.fullPath}\r\n`, err => { if (err) global.console.dir(err) })
          } catch (_error) { global.console.dir(_error) }
          // 進入錯誤顯示頁面
          return error({ statusCode: 404, message: `無法取得熱門關鍵字資料：${_err.response.data.Message}` })
        } else {
          try {
            fs.appendFile(`logs/homepage-nuxt-${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}.log`, `${Date()}    ${Date.now()}    FetchError${req ? '    ' + req.headers['user-agent'] : ''}    ${_err}    路徑：${route.fullPath}\r\n`, err => { if (err) global.console.dir(err) })
          } catch (_error) { global.console.dir(_error) }
          // 進入錯誤顯示頁面
          return error({ statusCode: 404, message: `無法取得熱門關鍵字資料：${_err}` })
        }
      })
    }
  },
  head () {
    return {
      // script: this.$store.state.isIE11 ? [{ hid: 'ie11', type: 'text/javascript', charset: 'utf-8', src: 'js/polyfill.min.js' }] : []
    }
  }
}
</script>

<style lang="sass" scoped src="@/assets/sass/pages/index.sass" />
