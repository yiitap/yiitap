import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

function isDisabledNode({ node, types }) {
	return (
		(Array.isArray(types) && types.includes(node?.type)) || node?.type === types
	)
}

function shouldInsert({ node, types }) {
	if (!node) return false
	return !isDisabledNode({ node, types })
}

const OTrailingNode = Extension.create({
	name: 'trailingNode',

	addOptions() {
		return {
			node: 'paragraph',
			notAfter: ['paragraph'],
		}
	},

	addProseMirrorPlugins() {
		const plugin = new PluginKey(this.name)
		const disabledNodes = Object.entries(this.editor.schema.nodes)
			.map(([, value]) => value)
			.filter((node) => this.options.notAfter.includes(node.name))

		return [
			new Plugin({
				key: plugin,
				appendTransaction: (_, __, state) => {
					const { doc, tr, schema } = state
					const shouldInsertNodeAtEnd = plugin.getState(state)
					const endPosition = doc.content.size
					const type = schema.nodes[this.options.node]

					if (!shouldInsertNodeAtEnd) return
					// console.log('append', type)

					return tr.insert(endPosition, type.create())
				},
				state: {
					init: (_, state) => {
						const lastChild = state.tr.doc.lastChild
						const lastChildContent = lastChild?.firstChild ?? null
						// console.log('init', lastChild?.type.name, lastChildContent?.type.name)

						return (
							shouldInsert({ node: lastChild, types: disabledNodes }) ||
							shouldInsert({ node: lastChildContent, types: disabledNodes })
						)
					},
					apply: (tr, value) => {
						if (!tr.docChanged) return value

						const lastChild = tr.doc.lastChild
						const lastChildContent = tr.doc.lastChild?.firstChild ?? null

						return (
							shouldInsert({ node: lastChild, types: disabledNodes }) ||
							shouldInsert({ node: lastChildContent, types: disabledNodes })
						)
					},
				},
			}),
		]
	},
})

export default OTrailingNode
