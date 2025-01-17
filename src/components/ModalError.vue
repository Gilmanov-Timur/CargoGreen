<template>
	<b-modal
		id="modal-error"
		centered
		scrollable
		no-close-on-backdrop
		:no-close-on-esc="criticalError"
		:hide-header-close="criticalError"
		size="lg"
		header-close-label="Закрыть"
		title="Ошибка"
		header-text-variant="light"
		header-bg-variant="danger"
		@hidden="() => $store.dispatch('clearError')"
	>
		<template v-slot:modal-title>
			<BIconExclamationTriangle/>
			Ошибка
		</template>
		<template v-slot:default>
			<div v-html="message" />
		</template>
		<template v-slot:modal-footer>
			<div class="w-100" v-if="criticalError">
				<b-button variant="info" class="float-left" href="https://greenpost.uz">
					Вернуться на сайт
				</b-button>
				<b-button variant="info" class="float-right" @click.prevent="onReload">
					Обновить страницу
				</b-button>
			</div>
			<b-button class="m-auto" @click.prevent="$bvModal.hide('modal-error')" v-else>
				Закрыть
			</b-button>
		</template>
	</b-modal>
</template>


<script>
	import messages from '@/utils/messages'

	export default {
		data() {
			return {
			}
		},
		computed: {
			message() {
				return messages[this.error] || this.error
			},
			criticalError() {
				return this.error === 'critical-error'
			}
		},
		mounted() {

		},
		methods: {
			onReload() {
				window.location.reload()
			}
		},
		props: ['error']
	}
</script>
