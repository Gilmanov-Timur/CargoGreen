<template>
	<div id="app" class="h-100">
		<router-view />
		<ModalError :error="error" />
	</div>
</template>

<script>
	import messages from '@/utils/messages'

	export default {
		name: 'App',
		computed: {
			error() {
				return this.$store.getters.error
			},
			toast() {
				return this.$store.getters.toast
			},
		},
		mounted() {

		},
		watch: {
			async error(message) {
				if (!message) {
					return
				}

				if (message === 'unauthorized' && !this.$route.path.startsWith('/auth')) {
					await this.$store.dispatch('logout', 'login')
					await this.$router.push('/auth')
					await this.$store.dispatch('clearError')
				} else {
					this.$bvModal.show('modal-error')
				}
			},
			toast(message) {
				if (!message) {
					return
				}

				this.$toast(messages[message] || message)
				this.$store.dispatch('clearToast')
			}
		},
		components: {
			'ModalError': require('@/components/ModalError.vue').default
		},
	}
</script>

<style lang="scss">
	@import 'assets/variables';
	@import '~bootstrap/scss/bootstrap';
	@import '~bootstrap-vue';
	@import 'assets/styles';
</style>