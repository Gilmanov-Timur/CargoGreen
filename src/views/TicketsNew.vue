<template>
	<div>
		<Loader v-if="loading" />

		<div class="row mb-4 mx-n2">
			<div class="col-auto px-2">
				<router-link to="/tickets" title="Вернуться к списку обращений">
					<b-icon icon="arrow-left-circle" font-scale="2" variant="info" />
				</router-link>
			</div>
			<div class="col px-2">
				<h4 class="m-0">Новое обращение</h4>
			</div>
		</div>

		<b-form @submit.prevent="onSubmit">
			<b-form-group label="Тип:" label-for="ticket-type">
				<b-form-select
					id="ticket-type"
					v-model="form.selectedType"
					:options="form.typeOptions"
					:disabled="loading"
					required
				/>
			</b-form-group>

			<b-form-group label="Заголовок:" label-for="ticket-title">
				<b-form-input
					id="ticket-title"
					v-model.trim="form.title"
					type="text"
					:disabled="loading"
					required
				/>
			</b-form-group>

			<b-form-group label="Номер заказа/посылки:" label-for="ticket-order">
				<b-form-input
					id="ticket-order"
					v-model.trim="form.order"
					type="text"
					:disabled="loading"
					required
				/>
			</b-form-group>

			<b-form-group label="Сообщение:" label-for="ticket-message">
				<b-form-textarea
					id="ticket-message"
					v-model="form.message"
					rows="3"
					:disabled="loading"
					required
				/>
			</b-form-group>

			<b-button type="submit" variant="primary" :disabled="loading">
				Создать
			</b-button>
		</b-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			ticketId: null,
			form: {
				title: '',
				message: '',
				order: '',
				selectedType: null,
				typeOptions: [
					{ value: null, text: 'Выберите тему', disabled: true },
					{ value: 'Заказ', text: 'Заказ' },
					{ value: 'Посылка', text: 'Посылка' },
				]
			}
		}
	},
	async mounted() {

	},
	beforeDestroy() {
		this.$store.dispatch('cancelRequest')
	},
	computed: {
		userInfo() {
			return this.$store.getters.userInfo
		},
	},
	methods: {
		async onSubmit() {
			await this.createTicket()
		},
		async createTicket() {
			const formData = {
				'Заголовок': this.form.title,
				'ВидОснования': this.form.selectedType,
				'IDОснования': this.form.order,
			}

			this.loading = true

			try {
				const response = await this.$store.dispatch('newTicket', formData)
				this.ticketId = response['НомерТикета']
				this.$toast(`Обращение ${response['НомерТикета']} успешно создано!`)
				await this.sendMessage()
			} catch (e) {} finally {
				this.loading = false
			}
		},
		async sendMessage() {
			const formData = {
				'НомерТикета': this.ticketId,
				'Автор': `${this.userInfo['Фамилия']} ${this.userInfo['Имя']}`,
				'Текст': this.form.message
			}

			try {
				await this.$store.dispatch('sendTicketMessage', formData)
				this.$toast('Сообщение успешно отправлено!')
				await this.$router.replace('/tickets')
			} catch (e) {} finally {}
		}
	},
	components: {

	},
}
</script>
