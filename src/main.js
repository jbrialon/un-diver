// eslint-disable-next-line
import * as NormalizeRAF from './utils/NormalizeRAF.js'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store/index.js'
import { i18n } from '@/i18n'
import html2canvas from 'html2canvas'
import HtmlTextureManager from '@/utils/HtmlTextureManager'

// require('viewport-units-buggyfill').init()

Vue.config.productionTip = false

Vue.directive('html-to-texture', (element, binding) => {
  HtmlTextureManager.setCanvasPromise(binding.value, html2canvas(element, {backgroundColor: null, logging: false}))
})

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
