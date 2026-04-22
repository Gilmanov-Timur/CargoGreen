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

        <hr />

        <div class="form-group">
          <label for="form-delivery-point">
            Куда доставить <span class="text-danger">*</span>
          </label>
          <b-form-select
            id="form-delivery-point"
            v-model="form.deliveryPoint"
            :options="deliveryPointOptions"
            required
          />
        </div>

        <div
          v-if="form.deliveryPoint === 'Fillial'"
          class="form-group"
        >
          <label for="filial-select">
            Выберите филиал <span class="text-danger">*</span>
          </label>
          <b-form-select
            id="filial-select"
            v-model="form.filialCode"
            :options="filialOptions"
            required
          />
          <div v-if="selectedFilialAddress" class="pt-1">
            {{ selectedFilialAddress }}
          </div>
        </div>

        <div
          v-if="form.deliveryPoint === 'Taskent'"
          class="form-group"
        >
          <label for="delivery-address">
            Введите адрес <span class="text-danger">*</span>
          </label>
          <b-input
            id="delivery-address"
            v-model="form.deliveryAddress"
            required
          />
        </div>

        <template v-if="form.deliveryPoint === 'Region'">
          <div class="form-group">
            <label for="region-select">
              Выберите регион <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="region-select"
              v-model="form.regionCode"
              :options="regionOptions"
              required
              @change="form.pickupPointCode = null"
            />
          </div>

          <div
            v-if="form.regionCode"
            class="form-group"
          >
            <label for="pickup-point-select">
              Выберите пункт выдачи <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="pickup-point-select"
              v-model="form.pickupPointCode"
              :options="pickupPointOptions"
              required
            />
            <div v-if="selectedPickupPointAddress" class="pt-1">
              {{ selectedPickupPointAddress }}
            </div>
          </div>
        </template>

<!--				<div class="form-row form-group">-->
<!--					<label for="form-region" class="col-5 col-form-label">-->
<!--						Филиал <span class="text-danger">*</span>-->
<!--					</label>-->
<!--					<div class="col">-->
<!--						<b-form-select-->
<!--							id="form-region"-->
<!--							v-model="form.pickupPoint"-->
<!--							:options="pickupOptions"-->
<!--							required-->
<!--						/>-->
<!--						<div class="pt-1">-->
<!--							{{ selectedPickupAddress }}-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>-->

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
	const formDefaultData = {
		recipientId: '',
		name: '',
		passport: '',
		pinfl: '',
		phone: '',
    deliveryPoint: null,
    filialCode: null,
    deliveryAddress: null,
    regionCode: null,
    pickupPointCode: null,
	}
	export default {
		data() {
			return {
				loading: false,
				submitted: false,
				form: structuredClone(formDefaultData),
			}
		},
		props: ['selectedRecipient'],
		methods: {
			onShow() {
				this.resetForm()

				if (this.selectedRecipient) {
          const deliveryCode = this.selectedRecipient['НомерУслугиПосылки'];
          let deliveryPoint = this.deliveryPoints?.Taskent.code === deliveryCode ? 'Taskent' : null;

          if (!deliveryPoint && deliveryCode) {
            deliveryPoint = this.deliveryPoints?.Fillial.map(filial => filial.code).includes(deliveryCode)
              ? 'Fillial'
              : 'Region'
          }

					this.form.recipientId = this.selectedRecipient['Номер']
					this.form.name = this.selectedRecipient['ФИО']
					this.form.passport = this.selectedRecipient['СерияНомерПаспорта']
					this.form.pinfl = this.selectedRecipient['ПИНФЛ']
					this.form.phone = this.selectedRecipient['Телефон']
					this.form.deliveryPoint = deliveryPoint

          if (deliveryPoint === 'Taskent') {
            this.form.deliveryAddress = this.selectedRecipient['АдресПосылки']
          } else if (deliveryPoint === 'Fillial') {
            this.form.filialCode = deliveryCode
          } else {
            const regionCode = this.deliveryPoints?.Region.find(region => region.data.map(item => item.code).includes(deliveryCode))?.code
            this.form.regionCode = regionCode
            this.form.pickupPointCode = deliveryCode
          }
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
				const formData = {
					'ФИО': this.form.name,
					'НомерПолучателя': this.form.recipientId,
					'НомерСтраны': '000000001',
					// 'Область': 'г. Ташкент',
					// 'Район': pickupPoint.district,
					// 'Город': '',
					// 'Улица': pickupPoint.street,
					// 'Дом': pickupPoint.house,
					// 'Квартира' : '',
					'Телефон': this.form.phone,
					'СерияНомерПаспорта': this.form.passport,
					'ПИНФЛ': this.form.pinfl,
					'ДатаРождения': getBirthdateFromPinfl(this.form.pinfl),
				}

        if (this.form.deliveryPoint === 'Taskent') {
          formData['НомерУслугиПосылки'] = this.deliveryPoints?.Taskent.code;
          formData['АдресПосылки'] = this.form.deliveryAddress?.trim();
        } else if (this.form.deliveryPoint === 'Region') {
          formData['НомерУслугиПосылки'] = this.form.pickupPointCode;
          formData['АдресПосылки'] = this.selectedPickupPointAddress?.trim();
        } else {
          formData['НомерУслугиПосылки'] = this.form.filialCode;
          formData['АдресПосылки'] = this.selectedFilialAddress?.trim();
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
      deliveryPoints() {
        return this.$store.getters.deliveryPoints
      },
      deliveryPointOptions() {
        return [
          {
            text: 'До филиала',
            value: 'Fillial',
          },
          {
            text: 'По адресу г. Ташкент',
            value: 'Taskent',
          },
          {
            text: 'По областям Узбекистана',
            value: 'Region',
          },
        ];
      },
      filialOptions() {
        return this.deliveryPoints?.Fillial.map(filial => ({
          text: filial.name,
          value: filial.code
        })) || []
      },
      selectedFilialAddress() {
        return this.deliveryPoints?.Fillial.find(filial => filial.code === this.form.filialCode)?.address
      },
      regionOptions() {
        return this.deliveryPoints?.Region.map(filial => ({
          text: filial.name,
          value: filial.code
        })) || []
      },
      pickupPointOptions() {
        const pickupPoints = this.deliveryPoints?.Region.find(region => region.code === this.form.regionCode)?.data

        return pickupPoints?.map(point => ({
          text: point.name,
          value: point.code
        })) || []
      },
      selectedPickupPointAddress() {
        return this.deliveryPoints?.Region.map(region => region.data).flat().find(point => point.code === this.form.pickupPointCode)?.address
      }
		},
	}
</script>
