<template>
	<b-modal
		id="modal-edit-recipient"
		centered
		scrollable
		no-close-on-backdrop
		header-close-label="Закрыть"
		:title="selectedRecipient ? 'Редактирование получателя' : 'Добавить нового получателя'"
		:hide-header-close="!selectedRecipient"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
		@hide="$emit('hide')"
	>
		<template v-slot:default>
			<Loader v-if="loading" />
			<b-form @submit.prevent="onSubmit">
				<div class="form-row form-group">
					<label for="form-name" class="col-5 col-form-label">
						ФИО <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-input id="form-name" v-model.trim="form.name" required />
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-passport" class="col-5 col-form-label">
						Серия/номер паспорта <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="text"
							id="form-passport"
							class="form-control"
							v-model.trim="form.passport"
							v-mask="{mask: 'AA9999999', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
							required
						/>
					</div>
					<div class="col-12" v-if="isInternationalPassport">
						<div class="alert alert-danger mt-2 mb-0">
							Загранпаспорт не подходит для сервиса
						</div>
					</div>
				</div>

				<div class="form-row form-group">
					<div class="col-5 col-form-label">
						<label for="form-pinfl" class="mb-0 mr-1">
							ПИНФЛ
						</label>
						<BIconQuestionCircle
							class="cursor-pointer mr-1"
							@click="$bvModal.show('modal-pinfl')"
						/>
						<span class="text-danger">*</span>
					</div>
					<div class="col">
						<input
							type="tel"
							id="form-pinfl"
							class="form-control"
							:class="{'border-danger': submitted && !isPinflValid}"
							v-model.trim="form.pinfl"
							v-mask="{mask: '99999999999999', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
							required
						/>
					</div>
					<div class="col-12" v-if="submitted && !isPinflValid">
						<div class="alert alert-danger mt-2 mb-0">
							Введите корректный ПИНФЛ
						</div>
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-phone" class="col-5 col-form-label">
						Номер телефона <span class="text-danger">*</span>
					</label>
					<div class="col">
						<input
							type="tel"
							id="form-phone"
							class="form-control"
							v-model.trim="form.phone"
							v-mask="{mask: '+[999999999999]', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
							required
						/>
					</div>
				</div>

				<div class="form-row form-group">
					<label for="form-region" class="col-5 col-form-label">
						Филиал <span class="text-danger">*</span>
					</label>
					<div class="col">
						<b-form-select
							id="form-region"
							v-model="form.pickupPoint"
							:options="pickupOptions"
							required
						/>
						<div class="pt-1">
							{{ selectedPickupAddress }}
						</div>
					</div>
				</div>

				<button type="submit" class="d-none" ref="submitButton" />
			</b-form>
		</template>
		<template v-slot:modal-footer>
			<div class="w-100">
				<b-button variant="success" :disabled="loading" @click.prevent="onSave">
					Сохранить
				</b-button>
			</div>
		</template>
	</b-modal>
</template>

<script>
	import {getBirthdateFromPinfl, isPinflCorrect} from '@/utils/functions'
	import { pickupPoints } from "../utils/constants";
	import { getPickupPointIndex } from "../utils/functions";
	const formDefaultData = {
		recipientId: '',
		name: '',
		passport: '',
		pinfl: '',
		phone: '',
		pickupPoint: '',
	}
	export default {
		data() {
			return {
				loading: false,
				submitted: false,
				form: structuredClone(formDefaultData),
				pickupPoints: pickupPoints
			}
		},
		props: ['selectedRecipient'],
		methods: {
			onShow() {
				this.resetForm()

				if (this.selectedRecipient) {
					const pickupPointIndex = getPickupPointIndex(this.selectedRecipient['Район'], this.selectedRecipient['Улица'], this.selectedRecipient['Дом']);

					this.form.recipientId = this.selectedRecipient['Номер']
					this.form.name = this.selectedRecipient['ФИО']
					this.form.passport = this.selectedRecipient['СерияНомерПаспорта']
					this.form.pinfl = this.selectedRecipient['ПИНФЛ']
					this.form.phone = this.selectedRecipient['Телефон']
					this.form.pickupPoint = pickupPointIndex !== -1 ? pickupPointIndex : ''
				}
			},
			onSubmit() {
				this.submitted = true
				if (!this.isInternationalPassport && this.isPinflValid) {
					this.submitForm()
				}
			},
			resetForm() {
				this.submitted = false
				this.form = structuredClone(formDefaultData)
			},
			async onSave() {
				this.$refs.submitButton.click()
			},
			async submitForm() {
				const pickupPoint = this.pickupPoints[this.form.pickupPoint];

				const formData = {
					'ФИО': this.form.name,
					'НомерПолучателя': this.form.recipientId,
					'НомерСтраны': '000000001',
					'Область': 'г. Ташкент',
					'Район': pickupPoint.district,
					'Город': '',
					'Улица': pickupPoint.street,
					'Дом': pickupPoint.house,
					'Квартира' : '',
					'Телефон': this.form.phone,
					'СерияНомерПаспорта': this.form.passport,
					'ПИНФЛ': this.form.pinfl,
					'ДатаРождения': getBirthdateFromPinfl(this.form.pinfl),
				}

				this.loading = true

				try {
					await this.$store.dispatch('updateRecipient', formData)
					this.$bvModal.hide('modal-edit-recipient')
					this.$emit('reloadRecipients')
					this.$toast(this.selectedRecipient ? 'Получатель успешно отредактирован!' : 'Получатель успешно создан!')
				} catch (e) {} finally {
					this.loading = false
				}
			},
		},
		computed: {
			isInternationalPassport() {
				return this.form.passport.indexOf('FA') === 0
			},
			isPinflValid() {
				return isPinflCorrect(this.form.pinfl)
			},
			pickupOptions() {
				return this.pickupPoints.map((point, index) => {
					return {
						value: index,
						text: point.name
					}
				})
			},
			selectedPickupAddress() {
				const point = this.pickupPoints[this.form.pickupPoint]

				if (point) {
					return `${point.district}, ${point.street}, ${point.house}`
				}
			},
		},
	}
</script>
