import * as Stats from 'stats.js'
// eslint-disable-next-line
import * as NormalizeRAF from './utils/NormalizeRAF.js'
import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

let stats
if (process.env.NODE_ENV === 'development') {
  stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)
  requestAnimationFrame(animate)
}

function animate () {
  stats.begin()
  // monitored code goes here
  stats.end()
  requestAnimationFrame(animate)
}
