import { computed, inject } from 'vue'
import { getMessage } from '../i18n'

export default function () {
	const locale = inject('locale', { value: 'en' })

	const message = computed(() => {
		// console.log('locale', locale.value)
		return getMessage(locale.value)
	})

	function tr(key: string) {
		return key.split('.').reduce((o, i) => {
			if (o) return o[i]
		}, message.value)
	}

	return {
		locale,
		message,

		tr,
	}
}
