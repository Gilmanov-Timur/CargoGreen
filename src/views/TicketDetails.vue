<template>
	<div>
		<Loader v-if="loading" />

		<div class="row mb-3 mx-n2">
			<div class="col-auto px-2">
				<router-link to="/tickets">
					<b-icon icon="arrow-left-circle" font-scale="2" variant="info" />
				</router-link>
			</div>
			<div class="col px-2">
				<h4 class="m-0">Обращение <b>{{ ticketId }}</b></h4>
			</div>
		</div>

		<template v-if="ticket['Основание']">
			<h4>{{ ticket['Заголовок'] }}</h4>
			<div class="mb-3">
				<div>{{ ticket['Основание'] }}</div>
				<div>Дата: <b>{{ ticket['Дата'] }}</b></div>
				<div>
					Статус:
					<b-badge :variant="ticket['Статус'] === 'Завершен' ? 'success' : 'info'">
						{{ ticket['Статус'] }}
					</b-badge>
				</div>
			</div>
			<hr />
			<h5 class="font-weight-bold">Сообщения</h5>
			<div class="">
				<div v-if="ticket['ТаблицаСообщений'].length">
					<div v-for="(message, index) of ticket['ТаблицаСообщений'].slice().reverse()" :key="index"
						class="shadow-sm rounded mb-3 p-3" :class="!ticket['ОтветКлинета'] ? 'mr-md-5 client-message' : 'ml-md-5 support-message'"
					>
						<div class="mb-2 pb-1 border-bottom border-light">
							<small><b>{{ message['Автор'] }}</b> {{ message['Дата'] }}</small>
						</div>
						<div v-if="!ticket['ОтветКлинета']">
							{{ message['Сообщение'] }}
						</div>
						<div v-else v-html="message['Сообщение']"></div>
					</div>
				</div>
				<div v-else>
					<b-alert show variant="warning" class="d-inline-block">Сообщений нет</b-alert>
				</div>
			</div>
			<b-form ref="form" @submit.prevent="onSubmit" v-if="ticket['Статус']!=='Завершен'">
				<b-form-group label="Введите новое сообщение:" label-for="new-message">
					<b-form-textarea
						id="new-message"
						v-model="form.message"
						rows="3"
						:disabled="loading"
						required
					/>
				</b-form-group>

				<b-button type="submit" variant="primary" :disabled="loading">
					Отправить
				</b-button>
			</b-form>
		</template>

		<h3 v-if="!loading && !ticket['Основание']">Обращение не найдено!</h3>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			ticketId: this.$route.params.id,
			ticket: {},
			form: {
				message: '',
			}
		}
	},
	async mounted() {
		await this.getTicketDetails()
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
		async getTicketDetails() {
			this.loading = true

			try {
				this.ticket = await this.$store.dispatch('getTicketDetails', this.ticketId)
			} catch (e) {

			} finally {
				this.loading = false
			}
		},
		async onSubmit() {
			const formData = {
				'НомерТикета': this.ticketId,
				'Автор': `${this.userInfo['Фамилия']} ${this.userInfo['Имя']}`,
				'Текст': this.form.message
			}

			this.loading = true

			try {
				const response = await this.$store.dispatch('sendTicketMessage', formData)
				console.log(response.data)
				this.$toast('Сообщение успешно отправлено!')
				//document.getElementById('new-message').blur()
				this.form.message = ''
				//document.getElementById('message-form').reset()
				this.$refs.form.reset()
				await this.getTicketDetails()
				//this.$router.replace('/tickets')
			} catch (e) {

			} finally {
				this.loading = false
			}

			// try {
			// 	await api.updateOrder(formData)
			// } catch (e) {
			// 	this.$error(messages['something-went-wrong'])
			// } finally {
			// 	this.loading = false
			// }
		}
	},
	components: {

	},
}
</script>

<style scoped>
	.client-message {
		background: #cce5ff;
	}
	.support-message {
		background: #d4edda;
	}
</style>
