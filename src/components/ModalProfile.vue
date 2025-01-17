<template>
	<b-modal
		id="modal-profile"
		centered
		scrollable
		no-close-on-backdrop
		no-close-on-esc
		size="lg"
		header-close-label="Закрыть"
		title="Профиль"
		header-bg-variant="info"
		header-text-variant="white"
		footer-bg-variant="light"
		@show="onShow"
	>
		<template v-slot:default>
			<Loader v-if="loading" />

			<b-form @submit.prevent="onSubmit">
				<b-form-group label="Фамилия:" label-for="form-surname">
					<b-form-input
						id="form-surname"
						v-model.trim="form.surname"
						type="text"
						required
					/>
				</b-form-group>

				<b-form-group label="Имя:" label-for="form-name">
					<b-form-input
						id="form-name"
						v-model.trim="form.name"
						type="text"
						required
					/>
				</b-form-group>

				<b-form-group label="Номер телефона:" label-for="form-phone">
					<input
						type="tel"
						id="form-phone"
						class="form-control"
						v-model="form.phone"
						v-mask="{mask: '+[999999999999]', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
						required
					/>
				</b-form-group>

				<b-form-group label="Текущий пароль:" label-for="form-current-password">
					<b-form-input
						id="form-current-password"
						v-model.trim="form.currentPassword"
						type="password"
						:required="false"
					/>
				</b-form-group>

				<b-form-group label="Новый пароль:" label-for="form-new-password">
					<b-form-input
						id="form-new-password"
						v-model.trim="form.newPassword"
						type="password"
						:required="false"
					/>
					<div>
						<small>Оставьте это поле пустым, если не хотите изменять текущий пароль</small>
					</div>
				</b-form-group>

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
	export default {
		data() {
			return {
				loading: false,
				form: {
					surname: '',
					name: '',
					phone: '',
					currentPassword: '',
					newPassword: '',
				},
			}
		},
		mounted() {

		},
		methods: {
			onShow() {
				this.resetForm()
			},
			resetForm() {
				this.form.surname = this.userInfo['Фамилия']
				this.form.name = this.userInfo['Имя']
				this.form.phone = this.userInfo['Номертелефона']
				this.form.currentPassword = ''
				this.form.newPassword = ''
			},
			onSubmit() {
				this.submitForm()
			},
			onSave() {
				this.$refs.submitButton.click()
			},
			async submitForm() {
				const formData = {
					'НомерКлиента': this.userInfo['ID'],
					'Фамилия': this.form.surname,
					'Имя': this.form.name,
					'ЭлектронныйАдрес': this.userInfo['ЭлектронныйАдрес'],
					'НомерТелефона': this.form.phone,
					'Пароль': this.form.newPassword || this.form.currentPassword,
				}

				if (this.loading) {
					return
				}

				this.loading = true

				try {
					await this.$store.dispatch('updateUserInfo', {formData, currentPassword: this.form.currentPassword})
					this.$bvModal.hide('modal-profile')
					this.$toast('Профиль успешно обновлен!')
					try {
						await this.$store.dispatch('getUserInfo')
					} catch (e) {}
				} catch (e) {
					if (e.response && e.response.status === 401) {
						await this.$store.dispatch('setError', 'incorrect-password')
					}
				} finally {
					this.loading = false
				}
			},
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		watch: {

		}
	}
</script>
