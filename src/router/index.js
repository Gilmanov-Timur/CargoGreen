/* eslint-disable */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/auth',
		name: 'Auth',
		component: () => import('../layouts/Auth.vue'),
	},
	{
		path: '/',
		component: () => import('../layouts/Cabinet.vue'),
		children: [
			{
				path: '/',
				name: 'cabinetMain',
				meta: {auth: true},
				component: () => import('../views/Main.vue')
			},
			{
				path: 'packages',
				name: 'cabinetPackages',
				meta: {auth: true},
				component: () => import('../views/Packages.vue')
			},
			{
				path: 'package-details/:id',
				name: 'cabinetPackageDetails',
				meta: {auth: true},
				component: () => import('../views/PackageDetails.vue')
			},
			{
				path: 'payments',
				name: 'cabinetPayments',
				meta: {auth: true},
				component: () => import('../views/Payments.vue')
			},
			{
				path: 'recipients',
				name: 'cabinetRecipients',
				meta: {auth: true},
				component: () => import('../views/Recipients.vue')
			},
			{
				path: 'tickets',
				name: 'cabinetTickets',
				meta: {auth: true},
				component: () => import('../views/Tickets.vue')
			},
			{
				path: 'tickets/new',
				name: 'cabinetTicketsNew',
				meta: {auth: true},
				component: () => import('../views/TicketsNew.vue')
			},
			{
				path: 'tickets/:id',
				name: 'cabinetTicketDetails',
				meta: {auth: true},
				component: () => import('../views/TicketDetails.vue')
			},
		]
	},
	{
		path: '*',
		component: () => import('../layouts/Error.vue')
	}
]

const router = new VueRouter({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token')

	if (!token && to.name !== 'Auth') {
		next('/auth')
	} else if (token && to.name === 'Auth') {
		next('/')
	} else {
		next()
	}
});

export default router
