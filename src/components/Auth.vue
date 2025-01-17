<template>
	<b-container class="h-100">
		<div class="row align-items-center h-100">
			<div class="col col-sm-11 col-md-8 col-lg-6 col-xl-5 mx-auto">
				<Loader v-if="loading" />

				<div class="mb-5 text-center">
					<div class="d-inline-flex text-left text-green">
						<div class="logo">
							<img src="@/assets/logo-green.svg" alt="" />
						</div>
						<div>
							<div class="brand">
								CARGO GREEN
							</div>
							<div class="slogan">
								выгодная доставка из Китая
							</div>
						</div>
					</div>
				</div>

				<b-tabs card active-nav-item-class="text-success">
					<b-tab :title="$t('sign-in')">
						<b-card-text>
							<b-form @submit.prevent="onLogin">
								<b-form-group label="E-mail/Login:" label-for="login-email">
									<b-form-input
										id="login-email"
										v-model.trim="login.email"
										type="text"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group :label="$t('password') + ':'" label-for="login-password">
									<b-form-input
										id="login-password"
										v-model.trim="login.password"
										type="password"
										:disabled="loading"
										:required="false"
									/>
								</b-form-group>

								<b-button type="submit" variant="primary" :disabled="loading">
									{{ $t('log-in') }}
								</b-button>
							</b-form>
						</b-card-text>
					</b-tab>

					<b-tab :title="$t('registration')">
						<b-card-text>
							<b-form @submit.prevent="onRegister">
								<b-form-group :label="$t('surname') + ':'" label-for="register-surname">
									<b-form-input
										id="register-surname"
										v-model.trim="register.surname"
										type="text"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group :label="$t('name') + ':'" label-for="register-name">
									<b-form-input
										id="register-name"
										v-model.trim="register.name"
										type="text"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group label="E-mail:" label-for="register-email">
									<input
										type="email"
										id="register-email"
										class="form-control"
										v-model.trim="register.email"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group :label="$t('phone-number') + ':'" label-for="register-phone">
									<input
										type="tel"
										id="register-phone"
										class="form-control"
										v-model="register.phone"
										v-mask="{mask: '+[999999999999]', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group :label="$t('password') + ':'" label-for="register-password">
									<b-form-input
										id="register-password"
										v-model.trim="register.password"
										type="password"
										@input="register.passwordMismatch = false"
										:disabled="loading"
										required
									/>
								</b-form-group>

								<b-form-group :label="$t('repeat-password') + ':'" label-for="register-password2">
									<b-form-input
										id="register-password2"
										v-model.trim="register.password2"
										type="password"
										@input="register.passwordMismatch = false"
										:disabled="loading"
										required
									/>
									<b-tooltip :show.sync="register.passwordMismatch" target="register-password2" placement="topright" triggers="manual">
										{{ $t('password-mismatch') }}
									</b-tooltip>
								</b-form-group>

								<b-button type="submit" variant="primary" :disabled="loading">
									{{ $t('register') }}
								</b-button>
							</b-form>
						</b-card-text>
					</b-tab>
				</b-tabs>

				<Language class="mt-4" />
			</div>
		</div>
	</b-container>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				login: {
					email: '',
					password: '',
				},
				register: {
					surname: '',
					name: '',
					email: '',
					phone: '',
					password: '',
					password2: '',
					passwordMismatch: false
				}
			}
		},
		mounted() {

		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			async onLogin() {
				const formData = {
					email: this.login.email,
					password: this.login.password
				}

				if (this.loading) {
					return
				}

				this.loading = true

				try {
					await this.$store.dispatch('login', formData)
					await this.$router.push('/')
				} catch (e) {} finally {
					this.loading = false
				}
			},
			async onRegister() {
				const formData = {
					'source': 'cargogreen',
					'НомерКлиента': '',
					'Фамилия': this.register.surname,
					'Имя': this.register.name,
					'ЭлектронныйАдрес': this.register.email,
					'НомерТелефона': this.register.phone,
					'Пароль': this.register.password,
				}

				if (this.loading) {
					return
				}

				if (this.register.password !== this.register.password2) {
					this.register.passwordMismatch = true
					return
				}

				this.loading = true

				try {
					await this.$store.dispatch('register', formData)
					await this.$store.dispatch('login', {
						email: this.register.email,
						password: this.register.password,
					})
					await this.$router.push('/')
					this.$toast('Вы успешно зарегистрировались в системе GreenPost!')
					await this.$store.dispatch('setToast', 'register-success')
				} catch (e) {} finally {
					this.loading = false
				}
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		watch: {

		},
		components: {
			'Language': require('@/components/Language.vue').default,
		},
	}
</script>
