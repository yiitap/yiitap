import Link from '@tiptap/extension-link'
import type { LinkOptions } from '@tiptap/extension-link'
import { clickSelectHandler } from './helpers/clickSelectHandler'

const OLink = Link.extend<LinkOptions>({
	addProseMirrorPlugins() {
		return [
			...(this.parent?.() || []),
			clickSelectHandler({
				type: this.type,
			}),
		]
	},
}).configure({
	openOnClick: false,
})

export default OLink
