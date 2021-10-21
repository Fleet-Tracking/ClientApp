import Vue from 'nativescript-vue'
import VueDevtools from 'nativescript-vue-devtools'
import Main from './components/Main.vue'

declare let __DEV__: boolean;

Vue.use(VueDevtools, { host: '192.168.0.10', port: '8098' })

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__

new Vue({
  render: (h) => h('frame', [h(Main)]),
}).$start()
