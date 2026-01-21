<template>
	<div>
		<Loader v-if="loading" />

		<div class="row">
			<div class="col-sm-auto">
				<b-card class="order-search-form mb-3">
					<template v-slot:header>
						<div class="h3 mb-0">
							{{ $t('track-order') }}
						</div>
					</template>
					<b-card-text>
						<b-form @submit.prevent="onSubmit">
							<div class="form-group mb-0">
								<b-input-group>
									<b-input v-model.trim="track" :disabled="loading" :placeholder="$t('input-track-number')" required />
									<b-input-group-append>
										<b-button type="submit" variant="info" class="ml-1" :disabled="!track || loading">
											{{ $t('track') }}
										</b-button>
									</b-input-group-append>
								</b-input-group>
							</div>
						</b-form>
					</b-card-text>
				</b-card>
			</div>
			<div class="col-auto">
				<b-card class="mb-3">
					<template v-slot:header>
						<div class="h3 mb-0">{{ $t('your-china-address') }}</div>
					</template>
					<b-card-text>
						<div>
							<b>地址:</b> 广州市天河区龙洞街道龙湖山庄三巷7号富一层 AVTO {{ userInfo['ID'] }}
						</div>
						<div>
							<b>收货人:</b> Luyun {{ userInfo['ID'] }}
						</div>
						<div>
							<b>邮政编码:</b> 510520
						</div>
						<div>
							<b>手机号:</b> 17728037238
						</div>

						<hr />

						<div>
							<b>地址:</b> 广州市天河区龙洞街道龙湖山庄三巷7号富一层 AVIA {{ userInfo['ID'] }}
						</div>
						<div>
							<b>收货人:</b> Kongyun {{ userInfo['ID'] }}
						</div>
						<div>
							<b>邮政编码:</b> 510520
						</div>
						<div>
							<b>手机号:</b> 17728037238
						</div>
					</b-card-text>
				</b-card>
			</div>
		</div>

		<div v-if="searched">
			<div class="table-responsive" v-if="orders.length">
				<table class="table table-bordered">
					<tr class="table-info">
						<th class="align-middle">{{ $t('date') }}</th>
						<th class="align-middle">{{ $t('product-name') }}</th>
						<th class="align-middle">{{ $t('tracking-number') }}</th>
						<th class="align-middle">{{ $t('warehouse-receive') }}</th>
						<th class="align-middle">{{ $t('status') }}</th>
						<th class="align-middle">{{ $t('package') }}</th>
					</tr>
					<tr v-for="order of orders" :key="order['Номер']">
						<td class="align-middle">
							{{ order['Дата'] }}
						</td>
						<td class="align-middle">
							{{ order['ВидТовара'] }}
						</td>
						<td class="align-middle">
							{{ order['ТрекПоступления'] }}
						</td>
						<td class="align-middle">
							{{ order['ПоступилНаСклад'] }}
						</td>
						<td class="align-middle">
							{{ order['Статус'] }}
						</td>
						<td class="align-middle">
							{{ order['Посылка'] }}
						</td>
					</tr>
				</table>
			</div>
			<b-alert show variant="warning" class="d-inline-block" v-else>
				{{ $t('order-not-found') }}
			</b-alert>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				searched: false,
				track: null,
				orders: [],
			}
		},
		async mounted() {
			//await this.getRecipients();
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			onSubmit() {
				this.getOrders()
			},
			async getOrders() {
				const dateRange = {
					startDate: '',
					endDate: '',
				}

				this.loading = true

				try {
					const orders = (await this.$store.dispatch('getAllOrders', dateRange))
						.filter(order => order['ТрекПоступления'] === this.track)
					orders
						.sort((a, b) => Number(b['Номер'].replace(/\D/g, '')) - Number(a['Номер'].replace(/\D/g, '')))
					this.orders = orders
					this.searched = true
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
			async getRecipients() {
				try {
					const recipients = await this.$store.dispatch('getRecipients')
					console.log(recipients)
				} catch (e) {
					//this.loading = false
				}
			},
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			},
		},
	}
</script>
