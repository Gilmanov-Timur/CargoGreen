<template>
	<div class="h-100">
		<Loader v-if="loading" />

		<div class="h-100" v-if="serviceInfo && userInfo">
			<b-sidebar
				width="200px"
				shadow
				no-header
				backdrop
				bg-variant="dark"
				text-variant="light"
				:no-close-on-route-change="desktop"
				v-model="sidebarOpen"
			>
				<div class="d-flex flex-column h-100 py-3">
					<div class="mb-3 text-center px-3">
						<b-dropdown variant="dark">
							<template v-slot:button-content>
								<div class="user-avatar">
									<b-avatar round />
								</div>
								<div class="mb-1 text-white-50 text-wrap text-break">
									{{ userInfo['Фамилия'] }}
									{{ userInfo['Имя'] }}
								</div>
								<div class="user-id mb-1 text-white">
									ID: {{ userInfo.ID }}
								</div>
								<span class="text-white">
									{{ $t('balance') }}:
									<span :class="{'text-danger': balance < 0, 'text-success': balance > 0}">
										{{balance}}
									</span>$
								</span>
							</template>
							<b-dropdown-item-button @click.prevent="$bvModal.show('modal-profile')">
								<BIconPersonFill/>
								{{ $t('profile') }}
							</b-dropdown-item-button>
							<b-dropdown-divider />
							<b-dropdown-item-button @click.prevent="logout">
								<BIconDoorOpenFill/>
								{{ $t('exit') }}
							</b-dropdown-item-button>
						</b-dropdown>
					</div>

					<b-nav vertical class="cabinet-nav">
						<b-nav-item to="/" active-class="active" exact>
							<BIconHouseDoor/> {{ $t('main') }}
						</b-nav-item>
						<b-nav-item to="/packages" active-class="active">
							<BIconBox/> {{ $t('packages') }}
						</b-nav-item>
						<b-nav-item to="/payments" active-class="active" exact>
							<BIconWallet2/> {{ $t('payments') }}
						</b-nav-item>
						<b-nav-item to="/recipients" active-class="active" exact>
							<BIconPeople/> {{ $t('recipients') }}
						</b-nav-item>
						<b-nav-item to="/tickets" active-class="active" exact>
							<BIconEnvelope/> {{ $t('tickets') }}
						</b-nav-item>
					</b-nav>

					<Language />
				</div>
			</b-sidebar>

			<b-sidebar
				right
				width="250px"
				shadow
				no-header
				backdrop
				bg-variant="dark"
				text-variant="light"
				v-model="rightSidebar"
				sidebar-class="d-md-none"
			>
				<div class="py-3">
					<div class="col">
						<div class="h2">Контакты</div>
					</div>
					<Support class="flex-column contacts-sidebar" />
				</div>
			</b-sidebar>

			<main id="main" class="cabinet-main" :class="{'sidebar-open': sidebarOpen}">
				<b-navbar class="py-0">
					<b-navbar-nav class="row align-items-center m-0 w-100">
						<b-nav-text class="col-auto px-0 mr-3">
							<b-button size="sm" variant="outline-light" @click.prevent="sidebarOpen = !sidebarOpen">
								<BIconList font-scale="2" />
							</b-button>
						</b-nav-text>
						<b-nav-text class="col-auto px-0 px-lg-3 text-center">
							<div class="d-inline-flex text-white text-left">
								<div class="logo">
									<img src="@/assets/logo-white.svg" alt="" />
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
						</b-nav-text>
						<b-nav-text class="d-none d-md-block col-auto ml-auto pr-0">
							<Support class="small" />
						</b-nav-text>
						<b-nav-text class="d-md-none col-auto ml-auto px-0">
							<img
								src="@/assets/phone.svg"
								class="phone"
								width="32"
								height="32"
								alt=""
								@click="rightSidebar = !rightSidebar"
							/>
						</b-nav-text>
					</b-navbar-nav>
				</b-navbar>

				<div class="px-0 py-3">
					<b-container fluid>
						<router-view />
					</b-container>
				</div>
			</main>

			<ModalProfile />
			<ModalPinfl />
			<ModalEditRecipient v-if="$route.name !== 'cabinetRecipients'" />

		</div>
	</div>
</template>

<script>
	const desktopMinWidth = 992

	export default {
		data() {
			return {
				loading: true,
				sidebarOpen: window.innerWidth >= desktopMinWidth,
				desktop: window.innerWidth >= desktopMinWidth,
				rightSidebar: false,
			}
		},
		async mounted() {
			const promises = []

			this.$nextTick(() => {
				window.addEventListener('resize', this.onResize);
			})

			promises.push(
				this.$store.dispatch('getServiceInfo')
			)

			if (!this.userInfo) {
				promises.push(
					this.$store.dispatch('getUserInfo')
				)
			}

			this.getRecipients();

			try {
				await Promise.all(promises)
			} catch (e) {
				if (!(e.response && e.response.status === 401)) {
					await this.$store.dispatch('setError', 'critical-error')
				}
			} finally {
				this.loading = false
			}
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.onResize);
		},
		computed: {
			serviceInfo() {
				return this.$store.getters.serviceInfo
			},
			userInfo() {
				return this.$store.getters.userInfo
			},
			balance() {
				return this.userInfo['Баланс'].toFixed(2)
			},
		},
		methods: {
			async logout() {
				await this.$store.dispatch('logout', 'logout')
				await this.$router.push('/auth')
			},
			getNotifications() {
				this.$store.dispatch('getNotifications')
					.then(notifications => {
						if (Array.isArray(notifications) && notifications.length) {
							notifications.forEach(notification => {
								this.$bvModal.msgBoxConfirm([
									this.$createElement('pre', {
										domProps: {innerHTML: notification['Содержание']},
										style: {'white-space': 'pre-wrap'}
									})
								], {
									title: notification['Заголовок'],
									size: 'xl',
									headerTextVariant: 'light',
									headerBgVariant: 'info',
									headerCloseLabel: 'Закрыть',
									okVariant: 'info',
									okTitle: 'Больше не показывать',
									cancelTitle: '',
									hideHeaderClose: false,
									centered: true,
									footerClass: 'justify-content-center',
								})
									.then(clear => {
										if (clear) {
											const formData = {
												'идУведомления': notification['идУведомления']
											}
											this.$store.dispatch('clearNotification', formData)
										}
									})
							})
						}
					})
			},
			async getRecipients() {
				try {
					const recipients = await this.$store.dispatch('getRecipients')

					if (recipients.length === 0) {
						this.$bvModal.msgBoxOk('У вас нет получателя. Добавьте адрес получателя чтобы получить посылку.', {
							title: 'Добавьте получателя',
							okVariant: 'success',
							okTitle: 'Добавить получателя',
							headerClass: 'border-bottom-0',
							footerClass: 'border-top-0',
							centered: true,
							noCloseOnBackdrop: true,
							noCloseOnEsc: true,
							headerBgVariant: 'warning',
							footerBgVariant: 'light'
						})
							.then(() => {
								this.$bvModal.show('modal-edit-recipient')
							})

					}
				} catch (e) {
					//this.loading = false
				}
			},
			onResize() {
				this.desktop = window.innerWidth >= desktopMinWidth
			},
		},
		components: {
			'ModalProfile': require('@/components/ModalProfile.vue').default,
			'ModalPinfl': require('@/components/ModalPinfl.vue').default,
			'ModalEditRecipient': require('@/components/ModalEditRecipient.vue').default,
			'Support': require('@/components/Support.vue').default,
			'Language': require('@/components/Language.vue').default,
		},
	}
</script>
