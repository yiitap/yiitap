import { computed, inject } from 'vue'
import { getMessage } from '../i18n'

export default function () {
  const locale = inject('locale', { value: 'en' })

  const message = computed(() => {
    return getMessage(locale.value)
  })

  const languageName = computed(() => {
    return message.value?.name || 'English'
  })

  function tr(key: string) {
    return key.split('.').reduce((o, i) => {
      if (o) return o[i]
    }, message.value)
  }

  return {
    languageName,
    locale,
    message,

    tr,
  }
}
