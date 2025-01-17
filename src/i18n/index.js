import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ru from './ru.json'
import uz from './uz.json'
import cn from './cn.json'

let locale = localStorage.getItem('locale')

if (!['ru', 'uz', 'cn'].includes(locale)) {
	locale = 'ru'
}

Vue.use(VueI18n)

export default new VueI18n({
	locale: locale,
	fallbackLocale: locale,
	messages: {
		ru: ru,
		uz: uz,
		cn: cn,
	}
})
