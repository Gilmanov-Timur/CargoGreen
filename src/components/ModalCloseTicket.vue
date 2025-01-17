<template>
	<b-modal
		id="modal-close-ticket"
		centered
		scrollable
		no-close-on-backdrop
		header-close-label="Закрыть"
		:title="`Обращение ${ticketId}`"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
	>
		<template v-slot:default>
			<Loader v-if="loading" />

			<b-form @submit.prevent="onSubmit">
				<div class="form-group">
					<label for="form-comment" class="d-block">Комментарий</label>
					<b-form-textarea
						id="form-comment"
						v-model="form.comment"
						rows="3"
						:disabled="loading"
						required
					/>
				</div>

				<button type="submit" class="d-none" ref="submitButton" />
			</b-form>
		</template>
		<template v-slot:modal-footer>
			<div class="w-100">
				<b-button variant="success" :disabled="loading" @click.prevent="() => $refs.submitButton.click()">
					Закрыть обращение
				</b-button>
			</div>
		</template>
	</b-modal>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			form: {
				comment: '',
			},
		}
	},
	props: ['ticketId'],
	mounted() {

	},
	methods: {
		onShow() {
			this.resetForm()
		},
		onSubmit() {
			this.submitForm()
		},
		resetForm() {
			this.form.comment = ''
		},
		async submitForm() {
			const formData = {
				'НомерТикета': this.ticketId,
				'КомментарийЗакрытия': this.form.comment,
			}

			this.loading = true

			try {
				await this.$store.dispatch('closeTicket', formData)
				this.$bvModal.hide('modal-close-ticket')
				this.$emit('reloadTickets')
				this.$toast(`Обращение ${this.ticketId} закрыто!`)
			} catch (e) {

			} finally {
				this.loading = false
			}
		}
	},
}
</script>
