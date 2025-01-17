<template>
	<b-modal
		id="modal-new-package"
		centered
		scrollable
		no-close-on-backdrop
		no-close-on-esc
		size="lg"
		header-close-label="Закрыть"
		title="Оформить новую посылку"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
		@hide="onHide"
	>
		<template v-slot:default>
			<Loader v-if="loading" />

			<b-form @submit.prevent="onSubmit">
				<div class="form-row form-group align-items-end">
					<div class="col">
						<label for="form-recipient">
							Получатель
						</label>
						<b-input-group>
							<b-form-select
								id="form-recipient"
								v-model="form.recipientId"
								:options="recipientOptions"
								required
							/>
						</b-input-group>
					</div>
					<div class="col-auto">
						<b-button variant="info" @click.prevent="onEditRecipient">
							<b-icon icon="pencil-square"/>
							<span class="d-none d-lg-inline-block ml-2">Редактировать</span>
						</b-button>
					</div>
					<div class="col-auto">
						<b-button variant="info" @click.prevent="onNewRecipient">
							<BIconPlusCircle/>
							<span class="d-none d-lg-inline-block ml-2">Добавить</span>
						</b-button>
					</div>
				</div>

				<div class="alert alert-danger" v-if="!isRecipientPinflValid">
					У выбранного получателя не указан ПИНФЛ
					<BIconQuestionCircle
						class="cursor-pointer"
						@click="$bvModal.show('modal-pinfl')"
					/>
				</div>

				<div class="alert alert-danger" v-if="!isRecipientAddressValid">
					Обновите адрес получателя
				</div>

				<div class="form-group">
					<label for="form-delivery-method">
						Способ доставки
					</label>
					<b-input-group>
						<b-form-select
							id="form-delivery-method"
							v-model="form.deliveryMethod"
							:options="deliveryMethodOptions"
							:disabled="deliveryMethodOptions.length === 1"
							required
						/>
					</b-input-group>
					<b-alert class="mt-2 px-3" style="white-space:pre-line" show>
						{{ serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === form.deliveryMethod)['Комментарий'] }}
					</b-alert>
				</div>

				<div class="form-group">
					<label for="form-delivery-point">
						Доставить до
					</label>
					<b-input-group>
						<b-form-select
							id="form-delivery-point"
							v-model="form.deliveryPoint"
							:options="deliveryPointOptions"
							required
						/>
					</b-input-group>
				</div>

				<button type="submit" class="d-none" ref="submitButton" />
			</b-form>
		</template>
		<template v-slot:modal-footer>
			<div class="w-100">
				<b-button
					variant="success"
					:disabled="!recipientOptions.length || !isRecipientPinflValid || !isRecipientAddressValid || loading"
					@click.prevent="onSave"
				>
					Оформить
				</b-button>
			</div>
		</template>
	</b-modal>
</template>

<script>
import { isPinflCorrect, getBirthdateFromPinfl } from '@/utils/functions'
	export default {
		data() {
			return {
				loading: false,
				recipients: [],
				form: {
					recipientId: null,
					deliveryPoint: null,
					deliveryMethod: null,
				},
				recipientOptions: [],
				deliveryPointOptions: [
					{
						value: '000000001', text: 'Отделение GreenPost, г. Ташкент',
					},
					{
						value: '000000003', text: 'Адресная доставка, г. Ташкент',
					},
					{
						value: '000000004', text: 'Адресная доставка, регионы',
					},
				],
			}
		},
		props: ['checkedOrders', 'newOrderData', 'timestamp'],
		mounted() {

		},
		methods: {
			onShow() {
				this.resetForm()
				this.getRecipients()
			},
			async onHide() {
				await this.$store.dispatch('cancelRequest')
			},
			resetForm() {
				this.form.recipientId = null
				this.recipientOptions = []
				this.form.deliveryPoint = this.deliveryPointOptions[0].value
				this.form.deliveryMethod = this.deliveryMethodOptions[0].value
			},
			async getRecipients() {
				this.loading = true

				try {
					const recipients = await this.$store.dispatch('getRecipients')
					this.recipients = recipients
					this.recipientOptions = recipients.map(recipient => {
						const isValid = !!recipient['Район']
						return {
							value: recipient['Номер'],
							text: isValid
								? `${recipient['ФИО']}, ${recipient['Область']}, ${recipient['Район']}, ${recipient['Город'] ? (recipient['Город'] + ', ') : ''}${recipient['Улица']}, ${recipient['Дом']}${recipient['Квартира'] ? ('-' + recipient['Квартира']) : ''}`
								: `${recipient['ФИО']}, [Обновите адрес]`
						}
					})
					if (!this.form.recipientId) {
						this.form.recipientId = this.recipientOptions[0] && this.recipientOptions[0].value
					}
				} catch (e) {
					this.$bvModal.hide('modal-new-package')
				} finally {
					this.loading = false
				}
			},
			onSubmit() {
				this.submitForm()
			},
			onSave() {
				this.$refs.submitButton.click()
			},
			async submitForm() {
				const formData = {
					'НомерПосылки': '',
					"НомерПолучателя": this.form.recipientId,
					'НомерСклада': '000000001',
					'НомерВидаПеревозок': this.form.deliveryMethod,
					'НомерУслугиПосылки': this.form.deliveryPoint,
					'НомераЗаказов': this.checkedOrders?.map(order => order['Номер']) || ''
				}

				this.loading = true

				try {
					if (!this.selectedRecipient['ДатаРождения']) {
						await this.$store.dispatch('updateRecipient', {
							'ФИО': this.selectedRecipient['ФИО'],
							'НомерПолучателя': this.selectedRecipient['Номер'],
							'НомерСтраны': '000000001',
							'Область': this.selectedRecipient['Область'],
							'Город': this.selectedRecipient['Город'],
							'Улица': this.selectedRecipient['Улица'],
							'Дом': this.selectedRecipient['Дом'],
							'Квартира': this.selectedRecipient['Квартира'] || '',
							'Телефон': this.selectedRecipient['Телефон'],
							'СерияНомерПаспорта': this.selectedRecipient['СерияНомерПаспорта'],
							'ПИНФЛ': this.selectedRecipient['ПИНФЛ'],
							'ДатаРождения': getBirthdateFromPinfl(this.selectedRecipient['ПИНФЛ']),
						})
					}

					if (this.newOrderData) {
						const response = await this.$store.dispatch('updateOrder', this.newOrderData)
						formData['НомераЗаказов'] = [response['НомерЗаказа']]
						this.$toast(`Заказ ${response['НомерЗаказа']} успешно создан!`)
					}

					const response = await this.$store.dispatch('updatePackage', formData)
					this.$bvModal.hide('modal-new-package')
					this.$bvModal.hide('modal-edit-order')
					this.$emit('reloadOrders')
					this.$toast(`Посылка ${response['НомерПосылки']} успешно создана!`)
					await this.$store.dispatch('getUserInfo')
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
			onNewRecipient() {
				this.$bvModal.show('modal-edit-recipient')
			},
			onEditRecipient() {
				this.$emit('editRecipient', this.selectedRecipient)
			},
		},
		computed: {
			categoriesList() {
				return this.$store.getters.categoriesList
			},
			deliveryMethodOptions() {
				const subcategory = !!this.newOrderData
					? this.categoriesList?.map(category => category['Подкатегории']).flat().find(subcategory => subcategory['УИДПодкатегории'] === this.newOrderData['УИДПодкатегории'])
					: null
				const deliveryMethods = []
				const battery = !!this.newOrderData
					? this.newOrderData['СодержитБатареи'] || subcategory?.DG
					: this.checkedOrders.some(order => order['СодержитБатареи'])

				if (battery) {
					deliveryMethods.push({
						value: '000000004',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000004')['Наименование']
					})
					deliveryMethods.push({
						value: '000000003',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000003')['Наименование']
					})
					deliveryMethods.push({
						value: '000000009',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000009')['Наименование']
					})
				} else {
					if (!!this.newOrderData && !this.newOrderData['КопииBRAND'] || !this.newOrderData && this.checkedOrders.every(order => !order['ДополнительныеУслуги'].includes('Копии BRAND'))) {
						deliveryMethods.push({
							value: '000000001',
							text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000001')['Наименование']
						})
					}
					deliveryMethods.push({
						value: '000000006',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000006')['Наименование']
					})
					deliveryMethods.push({
						value: '000000003',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000003')['Наименование']
					})
					deliveryMethods.push({
						value: '000000010',
						text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000010')['Наименование']
					})
				}

				deliveryMethods.push({
					value: '000000011',
					text: this.serviceInfo['ВидыПеревозок'].find(delivery => delivery['Код'] === '000000011')['Наименование']
				})

				return deliveryMethods
			},
			serviceInfo() {
				return this.$store.getters.serviceInfo
			},
			selectedRecipient() {
				return this.recipients?.find(recipient => recipient['Номер'] === this.form.recipientId)
			},
			isRecipientPinflValid() {
				if (this.recipients.length && this.form.recipientId) {
					const pinfl = this.selectedRecipient['ПИНФЛ']
					return isPinflCorrect(pinfl)
				} else {
					return true
				}
			},
			isRecipientAddressValid() {
				if (this.recipients.length && this.form.recipientId) {
					return !!this.selectedRecipient['Район']
				} else {
					return true
				}
			},
		},
		watch: {
			timestamp: function () {
				this.getRecipients()
			},
		}
	}
</script>
