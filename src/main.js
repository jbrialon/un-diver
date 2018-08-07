import Vue from 'vue'
import App from './App.vue'

let vueApp = new Vue({
    el: document.querySelector('#app'),
    components: { App },
    render(h) {
        return h('App')
    }
});
