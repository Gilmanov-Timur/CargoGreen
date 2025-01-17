import axios from 'axios'
import api from '@/utils/api'

export default {
	actions: {
		async getTickets({commit}, id) {
			try {
				const response = await api.getTickets(id)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async newTicket({commit}, formData) {
			try {
				const response = await api.newTicket(formData)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async sendTicketMessage({commit}, formData) {
			try {
				const response = await api.sendTicketMessage(formData)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async getTicketDetails({commit}, ticketId) {
			try {
				const response = await api.getTicketDetails(ticketId)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async closeTicket({commit}, formData) {
			try {
				const response = await api.closeTicket(formData)
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
