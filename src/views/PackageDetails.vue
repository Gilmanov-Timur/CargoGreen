<template>
	<div>
		<Loader v-if="loading" />
		<div class="row mb-4 mx-n2">
			<div class="col-auto px-2">
				<router-link :to="backUrl ? backUrl : '/packages'">
					<b-icon icon="arrow-left-circle" font-scale="2" variant="info" />
				</router-link>
			</div>
			<div class="col px-2">
				<h4 class="m-0">Посылка <b>{{packageId}}</b></h4>
			</div>
		</div>
		<template v-if="packageId">
			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr class="table-info">
							<th class="align-middle">Получатель</th>
							<th class="align-middle">Общий вес</th>
							<th class="align-middle">Объемный вес</th>
							<th class="align-middle">Общая ценность</th>
							<th class="align-middle">Вид перевозки</th>
							<th class="align-middle">Номер отслеживания</th>
							<th class="align-middle">Рейс</th>
							<th class="align-middle">Тип доставки</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ pack['Получатель'] }}</td>
							<td>{{ pack['ОбщийВес'] }} кг</td>
							<td>{{ pack['Объемный'] }} кг</td>
							<td>{{ pack['ОбщаяЦенность'] }}</td>
							<td>{{ pack['ВидПеревозок'] }}</td>
							<td>{{ pack['Трек'] }}</td>
							<td>{{ pack['Вылет'] }}</td>
							<td>{{ pack['ТипДоставки'] }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h4>Товары в посылке</h4>
			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr class="table-info">
							<th class="align-middle">Наименование товара</th>
							<th class="align-middle">Кол-во</th>
							<th class="align-middle">Вес</th>
							<th class="align-middle">Ценность</th>
							<th class="align-middle">Номер отслеживания</th>
							<th class="align-middle">Комментарий</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(order, index) in pack['Заказы']" :key="index">
							<td>{{ order['НаименованиеТовара'] || order['видТовара'] }}</td>
							<td>{{ order['количество'] }}</td>
							<td>{{ order['вес'] }} кг</td>
							<td>{{ order['ценность'] }}$</td>
							<td>{{ order['трекПоступления'] }}</td>
							<td>{{ order['комментарий'] }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
		<b-alert variant="danger" show class="mt-4" v-else>
			Посылка не выбрана!
		</b-alert>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				packageId: this.$route.params.id,
				backUrl: this.$route.params.backUrl,
				loading: true,
				pack: []
			}
		},
		async mounted() {
			if (!this.packageId) {
				this.loading = false
				return
			}

			try {
				this.pack = await this.$store.dispatch('getPackageDetails', this.packageId)
			} catch (e) {} finally {
				this.loading = false
			}
		},
		beforeDestroy() {
			this.$store.dispatch('cancelRequest')
		},
		methods: {

		}
	}
</script>
