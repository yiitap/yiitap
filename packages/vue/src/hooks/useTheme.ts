import { computed, inject } from 'vue'

export default function () {
	const darkMode = inject('darkMode', { value: false })

	const theme = computed(() => {
		return darkMode.value ? 'dark' : 'light'
	})

	return {
		darkMode,
		theme,
	}
}
