/**
 * Copy to Clipboard
 *
 * @authr Quasar Team
 * see https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/copy-to-clipboard.js
 */
function fallback(text: string) {
	const area = document.createElement('textarea')
	area.value = text
	area.contentEditable = 'true'
	area.style.position = 'fixed' // avoid scrolling to bottom

	document.body.appendChild(area)
	area.focus()
	area.select()

	const res = document.execCommand('copy')

	area.remove()

	return res
}

export function copyToClipboard(text: string) {
	return navigator.clipboard !== void 0
		? navigator.clipboard.writeText(text)
		: new Promise((resolve, reject) => {
				const res = fallback(text)
				if (res) {
					resolve(true)
				} else {
					reject(res)
				}
			})
}
