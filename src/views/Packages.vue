<template>
	<div>
		<div class="row">
			<div class="col">
				<h2 class="mb-4">Посылки</h2>
			</div>
		</div>

		<Loader v-if="loading" />

		<b-card-text>
			<div class="table-responsive">
				<table class="table table-sm table-bordered table-striped">
					<thead>
						<tr class="table-info">
							<th class="align-middle py-2">Дата</th>
							<th class="align-middle py-2">Рейс</th>
							<th class="align-middle py-2">Номер отслеживания</th>
							<th class="align-middle py-2">Статус</th>
							<th class="align-middle py-2">Вес</th>
							<th class="align-middle py-2">Объемный вес</th>
							<th class="align-middle py-2">Ценность</th>
							<th class="align-middle py-2">Получатель</th>
							<th class="align-middle py-2">Стоимость доставки</th>
							<th class="align-middle py-2">Долг посылки</th>
							<th width="1" />
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="pack of packages"
							:key="pack['Номер']"
							:class="{'table-orange': pack['Объемный'] > pack['ОбщийВес']}"
						>
							<td class="align-middle">{{ pack['Дата'] }}</td>
							<td class="align-middle">{{pack['Рейс']}}</td>
							<td class="align-middle">{{pack['Трек']}}</td>
							<td class="align-middle">{{pack['Статус']}}</td>
							<td class="align-middle text-nowrap">{{pack['ОбщийВес']}} кг</td>
							<td class="align-middle text-nowrap">{{pack['Объемный']}} кг</td>
							<td class="align-middle text-nowrap">{{pack['ОбщаяЦенность']}} $</td>
							<td class="align-middle">{{pack['Получатель']}}</td>
							<td class="align-middle text-nowrap">
								{{ pack['ЦенаПосылки'] !== '' ? pack['ЦенаПосылки'].toFixed(2) + ' $' : '' }}
							</td>
							<td class="align-middle text-nowrap">
								{{ pack['ДолгПосылки'] !== '' ? pack['ДолгПосылки'].toFixed(2) + ' $' : '' }}
							</td>
							<td class="align-middle text-nowrap">
								<b-button size="sm" variant="info" class="mx-1" :disabled="loading" :to="`package-details/${pack['Номер']}`">
									<b-icon icon="eye-fill"/>
								</b-button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</b-card-text>
		<div class="d-inline-block d-md-block">
			<div>
				<span class="h5"><b-badge class="table-orange" v-html="'&ensp;'"/></span>
				- Объемный вес больше фактического
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				packages: [],
				selectedPackages: []
			}
		},
		async mounted() {
			await this.getPackages()
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {
			async getPackages() {
				const dateRange = {
					startDate: '',
					endDate: '',
				}

				this.loading = true

				try {
					const packages = await this.$store.dispatch('getPackages', dateRange)
					packages.sort((a, b) => b.timestamp - a.timestamp)
					this.packages = packages
				} catch (e) {} finally {
					this.loading = false
				}
			},
		},
		computed: {
			serviceInfo() {
				return this.$store.getters.serviceInfo
			},
		},
	}
</script>
