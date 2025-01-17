import axios from 'axios'
import api from '@/utils/api'

export default {
	actions: {
		async getPayments({commit}) {
			try {
				const response = await api.getPayments()
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
