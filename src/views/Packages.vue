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
              <th width="20" />
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
              <td class="align-middle">
                <b-form-checkbox
                  v-if="pack['ДолгПосылки'] > 0"
                  size="lg"
                  class="ml-2"
                  v-model="pack.checked"
                />
              </td>
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

    <div class="position-sticky float-right d-flex justify-content-end selected-orders pointer-events-none mb-2 mb-md-0 pt-md-5">
      <b-card bg-variant="light" border-variant="info" body-class="px-0 py-3" class="d-inline-block pointer-events-auto" v-if="checkedPackages.length">
        <div class="form-group">
          <div class="col-12">
            <label for="form-phone">
              Номер телефона для выставления счета <span class="text-danger">*</span>
            </label>
            <input
              type="tel"
              id="form-phone"
              class="form-control"
              :class="{'border-danger': submitted && !isPhoneValid}"
              v-model.trim="phone"
              v-mask="{mask: '+[999999999999]', greedy: false, showMaskOnHover: false, showMaskOnFocus: false}"
              required
            />
          </div>

          <div class="col-12" v-if="submitted && !isPhoneValid">
            <div class="alert alert-danger mt-2 mb-0">
              Введите корректный номер телефона
            </div>
          </div>
        </div>

        <div class="d-xl-flex align-items-center my-n2">
          <div class="col-auto my-2">
            <table class="text-nowrap">
              <tr>
                <td class="pr-2">Сумма:</td>
                <td align="right">
                  <b>{{ checkedPackagesPrice }}</b>$
                </td>
              </tr>
              <tr v-if="checkedPackagesPriceUZS">
                <td colspan="2" align="right">
                  = <b>{{ checkedPackagesPriceUZS.toLocaleString('ru') }}</b> сум
                </td>
              </tr>
            </table>
          </div>
          <div class="col-auto my-2">
            <b-button
              :class="{loading: isPaymentLoading}"
              size="lg"
              variant="success"
              @click.prevent="paymePayment"
            >
              <b-spinner variant="light" class="spinner" v-if="isPaymentLoading" />
              Оплатить через
              <img src="@/assets/payme.svg" width="74" height="24" alt="" />
            </b-button>
          </div>
        </div>
      </b-card>
    </div>

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
        isPaymentLoading: false,
				packages: [],
        phone: '',
        submitted: false,
			}
		},
		async mounted() {
      this.phone = this.userInfo['Номертелефона'] || '';
      await this.getPackages();

      if ('selectUnpaid' in this.$route.query) {
        this.selectUnpaidPackages();
      }
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
      async paymePayment() {
        this.submitted = true

        if (this.isPaymentLoading || !this.isPhoneValid) return;

        this.isPaymentLoading = true;

        try {
          await this.$store.dispatch('paymePayment', {
            phone: this.phone.replace(/\D/g, ''),
            packages: this.checkedPackages.map(pack => pack['Номер'])
          })

          this.$bvModal.msgBoxOk(`Счет выставлен на номер ${this.phone}. Проверьте телефон.`, {
            title: `Payme`,
            headerBgVariant: 'info',
            headerTextVariant: 'white',
            footerBgVariant: 'light',
            okVariant: 'success',
            okTitle: 'Закрыть',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true
          }).then(_ => {
            this.packages.forEach(pack => {
              pack.checked = false
            })
          });
        } catch (e) {} finally {
          this.isPaymentLoading = false;
        }
      },
      selectUnpaidPackages() {
        this.packages.forEach(pack => {
          if (pack['ДолгПосылки'] > 0) {
            pack.checked = true
          }
        })
      }
		},
		computed: {
      userInfo() {
        return this.$store.getters.userInfo
      },
      serviceInfo() {
        return this.$store.getters.serviceInfo
      },
      checkedPackages() {
        return this.packages.filter(pack => pack['checked'])
      },
      checkedPackagesPrice() {
        return this.checkedPackages.reduce((amount, pack) => amount + pack['ДолгПосылки'], 0).toFixed(2)
      },
      checkedPackagesPriceUZS() {
        return Number(this.checkedPackagesPrice) * this.$store.getters.currencyCourse
      },
      isPhoneValid() {
        return this.phone.replace(/\D/g, '').length === 12
      },
		},
    watch: {
      '$route.query': function () {
        if ('selectUnpaid' in this.$route.query) {
          this.selectUnpaidPackages();
        }
      },
    }
	}
</script>
