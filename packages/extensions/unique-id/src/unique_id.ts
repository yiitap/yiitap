import { Node } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { v4 } from 'uuid'

export const UniqueID = Node.create({
	name: 'uniqueID',
	priority: 10000,

	addOptions: () => ({
		attributeName: 'data-id',
		types: ['heading'],
		enableRender: false,
		generateId: () => v4(),
	}),

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					[this.options.attributeName]: {
						default: null,
						parseHTML: (element) => {
							return element.getAttribute(this.options.attributeName)
						},
						renderHTML: (attributes) => {
							return this.options.enableRender
								? {
										[this.options.attributeName]:
											attributes[this.options.attributeName],
									}
								: {}
						},
					},
				},
			},
		]
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey(this.name),
				props: {
					transformPastedHTML: (html) => {
						// Parse pasted HTML and ensure unique IDs when pasting.
						const doc = new DOMParser().parseFromString(html, 'text/html')
						const attributeName = this.options.attributeName
						doc.querySelectorAll(`[${attributeName}]`).forEach((el) => {
							el.setAttribute(attributeName, this.options.generateId())
						})
						return doc.body.innerHTML
					},
				},
				appendTransaction: (transactions, oldState, newState) => {
					const tr = newState.tr
					const attributeName = this.options.attributeName
					let modified = false

					newState.doc.descendants((node, pos) => {
						// 🚨Skip text node
						if (node.isText) return

						if (
							!node.attrs[attributeName] &&
							this.options.types.includes(node.type.name)
						) {
							tr.setNodeMarkup(pos, undefined, {
								...node.attrs,
								[attributeName]: this.options.generateId(),
							})
							modified = true
						}
					})

					return modified ? tr : null
				},
			}),
		]
	},
})
