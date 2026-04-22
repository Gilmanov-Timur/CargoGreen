<template>
	<div>
		<Loader v-if="loading" />

		<div class="row">
			<div class="col">
				<b-card class="mb-3">
					<template v-slot:header>
            <div class="h4 mb-0 mx-n2 mx-sm-0">{{ $t('your-china-address') }}</div>
					</template>
          <b-card-text class="mx-n2 mx-sm-0" style="font-size: 14px;">
						<div>
							<b>地址:</b> 广州市天河区龙洞商贸城自编V108号 AVTO {{ userInfo['ID'] }}
						</div>
						<div>
							<b>收货人:</b> Luyun {{ userInfo['ID'] }}
						</div>
						<div>
							<b>邮政编码:</b> 510520
						</div>
						<div>
							<b>手机号:</b> 13660551080
						</div>

						<hr />

						<div>
							<b>地址:</b> 广州市天河区龙洞商贸城自编V108号 AVIA {{ userInfo['ID'] }}
						</div>
						<div>
							<b>收货人:</b> Kongyun {{ userInfo['ID'] }}
						</div>
						<div>
							<b>邮政编码:</b> 510520
						</div>
						<div>
							<b>手机号:</b> 13660551080
						</div>
					</b-card-text>
				</b-card>
			</div>
		</div>

    <b-alert show class="px-2 px-sm-3">
      <pre style="white-space: pre-line; font-size: 100%;" class="m-0">
❗️ После добавления адреса на маркетплейс просим связаться с нами для проверки!
✈️ Авиа 3-7 дней - 9,5$/кг (Отправка: Вторник, Пятница)
🚛 Авто 20-30 дней - 5,5$/кг (Отправка: Суббота)
📦 Минималка 100 грамм
⚠️ Товары содержащие батарейки, жидкости, порошки, магниты, косметику и продукты питания можно отправлять только Авто.
📍 Наши филиалы: Мирабад, Чиланзар, Алмазар, Юнусабад, Мирзо-Улугбек, Яшнабад
🚚 Доставка по Узбекистану - 2 долл/шт посылку (0,1кг - 30 кг)
💰 Габаритные и коммерческие товары тарифицируются отдельно!
🔗 Более подробная информация на сайте <a href="https://cargogreen.uz" target="_blank">Cargogreen.uz</a></pre>
    </b-alert>

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
