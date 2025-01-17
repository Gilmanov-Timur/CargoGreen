import axios from 'axios'
import api from '@/utils/api'

export default {
	actions: {
		async getRecipients({commit}) {
			try {
				const response = await api.getRecipients()
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async updateRecipient({commit}, formData) {
			try {
				const response = await api.updateRecipient(formData)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async deleteRecipient({commit}, recipientId) {
			try {
				const response = await api.deleteRecipient(recipientId)
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