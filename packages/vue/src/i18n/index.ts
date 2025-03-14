import messageEn from './messages/en'
import messagePl from './messages/pl'
import messagePtBr from './messages/pt-br'
import messageZhHans from './messages/zh-hans'
import messageZhHant from './messages/zh-hant'

const messages: Indexable = {
  en: messageEn,
  'en-us': messageEn,
  pl: messagePl,
  'pt-br': messagePtBr,
  zh: messageZhHans,
  'zh-hans': messageZhHans,
  'zh-hant': messageZhHant,
}

export const DEFAULT_LOCALE = 'en'
const defaultMessage = messages[DEFAULT_LOCALE]

export const getMessage = (locale: string) => {
  return messages[locale] || defaultMessage
}

export default messages
