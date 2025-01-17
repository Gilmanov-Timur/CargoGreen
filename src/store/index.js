import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'
import user from './user'
import packages from './packages'
import recipients from './recipients'
import payments from './payments'
import tickets from './tickets'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		serviceInfo: null,
		categoriesList: null,
		skuList: null,
		error: null,
		toast: null,
	},
	actions: {
		async getNotifications({commit}) {
			try {
				const response = await api.getNotifications()
				return response.data
			} catch (e) {
				commit('setError', e)
				throw e
			}
		},
		async clearNotification({commit}, id) {
			try {
				const response = await api.clearNotification(id)
				return response.data
			} catch (e) {
				commit('setError', e)
				throw e
			}
		},
		async getServiceInfo({commit}) {
			try {
				const response = await api.getServiceInfo()
				commit('setServiceInfo', response.data)
				return response.data
			} catch (e) {
				commit('setError', e)
				throw e
			}
		},
		async getCategoriesList({commit}) {
			try {
				const response = await api.getCategoriesList()
				commit('setCategoriesList', response.data)
				return response.data
			} catch (e) {
				commit('setError', e)
				throw e
			}
		},
		async getSkuList({commit}) {
			try {
				const response = await api.getSkuList()
				commit('setSkuList', response.data)
				return response.data
			} catch (e) {
				commit('setError', e)
				throw e
			}
		},
		setError({commit}, error) {
			commit('setError', error)
		},
		clearError({commit}) {
			commit('clearError')
		},
		clearToast({commit}) {
			commit('clearToast')
		},
		cancelRequest() {
			api.cancelRequest()
		},
	},
	mutations: {
		setServiceInfo(state, info) {
			//const deliveryMethods = info['ВидыПеревозок']
			state.serviceInfo = info
		},
		setCategoriesList(state, categories) {
			state.categoriesList = categories
		},
		setSkuList(state, skuList) {
			state.skuList = skuList
		},
		setError(state, error) {
			let message

			if (error.response && error.response.status === 401) {
				message = 'unauthorized'
			} else if (error.response && error.response.data) {
				message = error.response.data
			} else if (typeof error === 'string') {
				message = error
			} else {
				message = 'something-went-wrong'
			}

			state.error = message
		},
		clearError(state) {
			state.error = null
		},
		setToast(state, message) {
			state.toast = message
		},
		clearToast(state) {
			state.toast = null
		},
	},
	getters: {
		serviceInfo: state => state.serviceInfo,
		categoriesList: state => state.categoriesList,
		skuList: state => state.skuList,
		error: state => state.error,
		toast: state => state.toast,
	},
	modules: {
		user, packages, recipients, payments, tickets
	}
})
