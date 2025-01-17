<template>
	<ul class="languages" v-if="false">
		<li
			v-for="locale in $i18n.availableLocales"
			:key="locale"
			:class="{active: $i18n.locale === locale}"
		>
			<button type="button" @click="changeLocale(`${locale}`)">
				<img :src="require(`@/assets/${locale}.svg`)" width="28" height="28" :alt="locale">
			</button>
		</li>
	</ul>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {
		changeLocale(locale) {
			this.$i18n.locale = locale
			localStorage.setItem('locale', locale)
		}
	}
}
</script>
