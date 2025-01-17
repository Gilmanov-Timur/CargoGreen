/* eslint-disable */
import axios from 'axios'
import api from '@/utils/api'

export default {
	state: {
		userInfo: null
	},
	actions: {
		async login({commit}, {email, password}) {
			const token = btoa(unescape(encodeURIComponent(`${email}:${password}`)))

			try {
				const response = await api.getUserInfo({email, password, token})
				localStorage.setItem('token', token)
				commit('setUserInfo', response.data)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async register({commit}, formData) {
			try {
				const response = await api.register(formData)
				return response.data
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async logout({commit}, message) {
			localStorage.removeItem('token')
			commit('clearUserInfo')

			if (message === 'logout') {
				commit('setToast', 'logout')
			} else if (message === 'login') {
				commit('setToast', 'login')
			}
		},

		async getUserInfo({commit}) {
			try {
				const response = await api.getUserInfo()
				commit('setUserInfo', response.data)
				return response
			} catch (e) {
				if (!axios.isCancel(e)) {
					commit('setError', e)
				}
				throw e
			}
		},

		async updateUserInfo({dispatch, commit}, {formData, currentPassword}) {
			const token = btoa(unescape(encodeURIComponent(`${formData['ЭлектронныйАдрес']}:${currentPassword}`)))

			try {
				await api.updateUserInfo({token, formData})
			} catch (e) {
				if (!(e.response && e.response.status === 401)) {
					commit('setError', e)
				}
				throw e
			}
		},
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
		clearUserInfo(state) {
			state.userInfo = null
		}
	},
	getters: {
		userInfo: state => state.userInfo
	},
}
