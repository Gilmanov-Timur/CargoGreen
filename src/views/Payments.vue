<template>
	<div>
		<Loader v-if="loading" />

		<div class="row">
			<div class="col">
				<h2 class="mb-4">Расчеты</h2>
			</div>
		</div>

		<template v-if="isMobile">
			<b-card v-for="payment of payments" :key="payment['Номер']" class="mb-4">
				<template #header>
					Посылка
					<a :href="`#/package-details/${payment['Номер']}`"
						@click.prevent="$router.push({ name: 'cabinetPackageDetails', params: { id: payment['Номер'], backUrl: '/payments' } })"
						v-if="payment['подробнее']"
					>
						{{ payment['Номер'] }}
					</a>
					<template v-else>
						{{ payment['Номер'] }}
					</template>
					от <b>{{payment['Дата']}}</b>
				</template>
				<div class="m-n2">
					<table class="table table-sm table-bordered mb-0">
						<tr class="table-info">
							<td class="align-middle">Вес</td>
							<td class="align-middle">Сумма</td>
							<td class="align-middle">Вид перевозки</td>
							<td class="align-middle" width="1"></td>
						</tr>
						<tr>
							<td class="align-middle">{{ payment['Вес'] || 0 }} кг</td>
							<td class="align-middle">{{ payment['Сумма'].toFixed(2) }} $</td>
							<td class="align-middle">{{ payment['ВидПеревозок'] }}</td>
							<td>
								<b-button size="sm" variant="info" @click.prevent="() => $set(payment, 'showDetails', !payment['showDetails'])" v-if="payment['подробнее'] && payment['подробнее'].length">
									<b-icon icon="three-dots"/>
								</b-button>
							</td>
						</tr>
					</table>
					<b-list-group class="mt-3" v-if="payment['showDetails']">
						<b-list-group-item class="p-2" v-for="(details, index) of payment['подробнее']" :key="index">
							<div class="row">
								<div class="col">
									{{ details['Название'] }}
								</div>
								<div class="col-auto font-weight-bold">
									{{ details['Сумма'].toFixed(2) }} $
								</div>
							</div>
						</b-list-group-item>
					</b-list-group>
				</div>
			</b-card>
		</template>
		<div class="table-responsive" v-else>
			<table class="table table-sm table-bordered">
				<tr class="table-info">
					<th class="align-middle">Номер посылки</th>
					<th class="align-middle">Дата</th>
					<th class="align-middle">Вид перевозки</th>
					<th class="align-middle">Вес</th>
					<th class="align-middle">Сумма</th>
					<th class="align-middle" width="1"></th>
				</tr>
				<template v-for="payment of payments">
					<tr :key="payment['Номер']">
						<td class="align-middle">
							<a :href="`#/package-details/${payment['Номер']}`"
								@click.prevent="$router.push({ name: 'cabinetPackageDetails', params: { id: payment['Номер'], backUrl: '/payments' } })"
								v-if="payment['подробнее']"
							>
								{{ payment['Номер'] }}
							</a>
							<template v-else>
								{{ payment['Номер'] }}
							</template>
						</td>
						<td class="align-middle">{{ payment['Дата'] }}</td>
						<td class="align-middle">{{ payment['ВидПеревозок'] }}</td>
						<td class="align-middle">{{ payment['Вес'] || 0 }} кг</td>
						<td class="align-middle">{{ payment['Сумма'].toFixed(2) }} $</td>
						<td class="align-middle">
							<b-button size="sm" variant="info" @click.prevent="() => $set(payment, 'showDetails', !payment['showDetails'])" v-if="payment['подробнее'] && payment['подробнее'].length">
								<b-icon icon="three-dots"/>
							</b-button>
						</td>
					</tr>
					<tr class="bg-light" v-if="payment['showDetails']" :key="payment['Дата']">
						<td colspan="6">
							<div class="d-inline-block">
								<b-list-group>
									<b-list-group-item v-for="(details, index) of payment['подробнее']" :key="index">
										<div class="row">
											<div class="col">
												{{ details['Название'] }}
											</div>
											<div class="col-auto font-weight-bold">
												{{ details['Сумма'].toFixed(2) }} $
											</div>
										</div>
									</b-list-group-item>
								</b-list-group>
							</div>
						</td>
					</tr>
				</template>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				payments: [],
			}
		},
		async mounted() {
			await this.getPayments()
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		computed: {
			isMobile() {
				return window.innerWidth < 992
			},
		},
		methods: {
			async getPayments() {
				this.loading = true

				try {
					const payments = (await this.$store.dispatch('getPayments'))
						.filter(order => !!order['Номер'])
					payments
						.sort((a, b) => Number(b['Номер']) - Number(a['Номер']))
					this.payments = payments
				} catch (e) {

				} finally {
					this.loading = false
				}
			},
			toggleDetails(id) {
				console.log(id)
			}
		},
		components: {

		},
	}
</script>
