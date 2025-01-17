export default {
	install(Vue) {
		Vue.prototype.$toast = function (html) {
			this.$bvToast.toast(html, {
				title: 'Информация',
				variant: 'info',
				solid: true,
				// title: 'BootstrapVue Toast',
				// autoHideDelay: 5000,
				// appendToast: append
			})
		}

		Vue.prototype.$error = function (html) {
			this.$bvToast.toast(html, {
				// title: 'BootstrapVue Toast',
				variant: 'danger',
				solid: true,
			})
		}
	}
}