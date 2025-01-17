import axios from 'axios'
import moment from 'moment'
import api from '@/utils/api'

export default {
	actions: {
		async getPackages({commit}, dateRange) {
			try {
				const packages = (await api.getPackages(dateRange)).data
				packages.forEach(pack => {
					pack.timestamp = moment(pack['Дата'], 'DD.MM.YYYY hh:mm:ss').toDate().getTime()
				})
				return packages
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async getPackageDetails({commit}, packageId) {
			try {
				const response = await api.getPackageDetails(packageId)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async updatePackage({commit}, formData) {
			try {
				const response = await api.updatePackage(formData)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async deletePackage({commit}, packageId) {
			try {
				const response = await api.deletePackage(packageId)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},
	}
}