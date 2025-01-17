<template>
	<div>
		<Loader v-if="loading" />

		<div class="row">
			<div class="col mb-3">
				<h2 class="mb-0">Обращения</h2>
			</div>
			<div class="col-auto mb-3">
				<b-button size="lg" variant="success" to="/tickets/new">
					<b-icon icon="plus-circle"/> Написать обращение
				</b-button>
			</div>
		</div>

		<div class="table-responsive">
			<table class="table table-sm table-bordered">
				<tr class="table-info">
					<th class="align-middle">Номер обращения</th>
					<th class="align-middle">Дата</th>
					<th class="align-middle">Заголовок</th>
					<th class="align-middle">Номер товара/посылки</th>
					<th class="align-middle">Статус</th>
					<th class="align-middle" width="1"></th>
				</tr>
				<tr v-for="ticket of tickets" :key="ticket['НомерТикета']">
					<td class="align-middle"><router-link :to="`/tickets/${ticket['НомерТикета']}`">{{ ticket['НомерТикета'] }}</router-link></td>
					<td class="align-middle">{{ ticket['Дата'] }}</td>
					<td class="align-middle">{{ ticket['Заголовок'] }}</td>
					<td class="align-middle">{{ ticket['Номер'] }}</td>
					<td class="align-middle">{{ ticket['Статус'] }}</td>
					<td class="align-middle">
						<b-button size="sm" variant="info" class="mx-1" @click="() => closeTicket(ticket['НомерТикета'])" v-if="ticket['Статус']!=='Завершен'">
							<b-icon icon="hand-thumbs-up"/>
						</b-button>
					</td>
				</tr>
			</table>
		</div>
		<h3 class="text-center" v-if="!tickets.length && !loading">
			У вас нет обращений
		</h3>

		<ModalCloseTicket :ticketId="selectedTicketId" @reloadTickets="getTickets" />
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			tickets: [],
			selectedTicketId: null
		}
	},
	async mounted() {
		await this.getTickets()
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
		async getTickets() {
			this.loading = true

			try {
				const tickets = await this.$store.dispatch('getTickets', this.userInfo.ID)
				tickets.sort((a, b) => Number(b['НомерТикета']) - Number(a['НомерТикета']))
				this.tickets = tickets
			} catch (e) {

			} finally {
				this.loading = false
			}
		},
		showModal() {
			this.$nextTick(() => {
				this.$bvModal.show('modal-close-ticket')
			})
		},
		closeTicket(id) {
			this.selectedTicketId = id
			this.showModal()
		}
	},
	components: {
		'ModalCloseTicket': require('@/components/ModalCloseTicket.vue').default,
	},
}
</script>
