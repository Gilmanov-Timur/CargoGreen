<template>
	<div>
		<Loader v-if="loading" />

		<div class="row">
			<div class="col mb-3">
				<h2 class="mb-0">Получатели</h2>
			</div>
			<div class="col-auto mb-3">
				<b-button size="lg" variant="success" @click.prevent="onAddRecipient">
					<b-icon icon="plus-circle"/> Добавить получателя
				</b-button>
			</div>
		</div>

		<div class="table-responsive">
			<table class="table table-bordered">
				<tr class="table-info">
					<th>#</th>
					<th>ФИО</th>
					<th>Номер телефона</th>
					<th>Регион</th>
					<th>Район (Город)</th>
					<th>Населенный пункт</th>
					<th>Улица</th>
					<th>Дом/квартира</th>
					<th>Управление</th>
				</tr>
				<tr v-for="(recipient, index) of recipients" :key="recipient['Номер']">
					<td>{{ index + 1 }}</td>
					<td>{{recipient['ФИО']}}</td>
					<td>{{recipient['Телефон']}}</td>
					<td>{{recipient['Область']}}</td>
					<td>{{recipient['Район']}}</td>
					<td>{{recipient['Город']}}</td>
					<td>{{recipient['Улица']}}</td>
					<td>{{recipient['Дом']}}{{recipient['Квартира'] ? ('-' + recipient['Квартира']) : ''}}</td>

					<td class="text-nowrap">
						<b-button size="sm" variant="info" class="mx-1" @click.prevent="() => onEdit(recipient['Номер'])">
							<b-icon icon="pencil-square"/>
						</b-button>
					</td>
				</tr>
			</table>
		</div>

		<ModalEditRecipient :selectedRecipient="selectedRecipient" @reloadRecipients="getRecipients" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				recipients: [],
				selectedRecipient: null
			}
		},
		async mounted() {
			await this.getRecipients()
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			async getRecipients() {
				this.loading = true

				try {
					const recipients = await this.$store.dispatch('getRecipients')
					recipients.forEach(recipient => {
						recipient['ПИНФЛ'] = recipient['ПИНФЛ'] === '0' ? '' : recipient['ПИНФЛ']
					})
					this.recipients = recipients
					this.loading = false
				} catch (e) {
					this.loading = false
				}
			},
			onEdit(recipientId) {
				this.selectedRecipient = this.recipients.find(recipient => recipient['Номер'] === recipientId)
				this.showModal()
			},
			async onDelete(recipientId) {
				this.loading = true

				try {
					await this.$store.dispatch('deleteRecipient', recipientId)
					this.$toast(`Получатель ${recipientId} успешно удален!`)
					await this.getRecipients()
				} catch (e) {
					this.loading = false
				} finally {}
			},
			onAddRecipient() {
				this.selectedRecipient = null
				this.showModal()
			},
			showModal() {
				this.$nextTick(() => {
					this.$bvModal.show('modal-edit-recipient')
				})
			}
		},
		components: {
			'ModalEditRecipient': require('@/components/ModalEditRecipient.vue').default
		},
	}
</script>
