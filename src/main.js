import * as Stats from 'stats.js'
// eslint-disable-next-line
import * as NormalizeRAF from './utils/NormalizeRAF.js'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store/index.js'
import i18n from '@/i18n'
import html2canvas from 'html2canvas'
import HtmlTextureManager from '@/utils/HtmlTextureManager'

Vue.config.productionTip = false

Vue.directive('html-to-texture', (element, binding) => {
  HtmlTextureManager.setCanvasPromise(binding.value, html2canvas(element, {backgroundColor: null, logging: false}))
})

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

function animate () {
  stats.begin()
  // monitored code goes here
  stats.end()
  requestAnimationFrame(animate)
}

let stats
if (process.env.NODE_ENV === 'development') {
  stats = new Stats()
  stats.domElement.className = 'stats'
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)
  animate()
}
