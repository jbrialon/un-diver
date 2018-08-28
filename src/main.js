import * as Stats from 'stats.js'
// eslint-disable-next-line
import * as NormalizeRAF from './utils/NormalizeRAF.js'
import Vue from 'vue'
import Watch from './Watch.vue'
import store from './store/index.js'
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: h => h(Watch)
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
