import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

import { findColors } from './utils'

export const ColorHighlighter = Extension.create({
	name: 'colorHighlighter',

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey('colorHighlighter'),
				state: {
					init(_, { doc }) {
						return findColors(doc)
					},
					apply(transaction, oldState) {
						return transaction.docChanged
							? findColors(transaction.doc)
							: oldState
					},
				},
				props: {
					decorations(state) {
						return this.getState(state)
					},
				},
			}),
		]
	},
})
