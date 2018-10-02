// eslint-disable-next-line
import * as NormalizeRAF from './utils/NormalizeRAF.js'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store/index.js'
import { i18n } from '@/i18n'
import Meta from 'vue-meta'

Vue.config.productionTip = false

Vue.use(Meta)
Vue.directive('html-to-texture', (element, binding) => {
  if (process.env.VUE_APP_SCREENSHOT) {
    element.setAttribute('data-screenshot', binding.value)
  }
})

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
