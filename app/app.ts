import Vue from 'nativescript-vue'
import Main from './components/Main.vue'
import { initialize } from './utils/firebase';

declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__

initialize().then((url) => console.info(url)).catch(err => console.error(err));

new Vue({
  render: (h) => h('frame', [h(Main)]),
}).$start()
