import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store'
import i18n from './i18n'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Loader from '@/components/Loader'
import messagePlugin from '@/utils/message.plugin'
import dateFilter from '@/filters/date.filter'
import './registerServiceWorker'
import maskDirective from '@/directives/mask.directive'

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(messagePlugin)
Vue.component('Loader', Loader)
Vue.filter('date', dateFilter)
Vue.directive('mask', maskDirective)

Vue.config.productionTip = false

new Vue({
	i18n,
	router,
	store,
	render: h => h(App)
}).$mount('#app')
