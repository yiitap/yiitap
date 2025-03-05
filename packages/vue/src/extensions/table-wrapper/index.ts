import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import View from './view.vue'

const OTableWrapper = Node.create({
	name: 'table-wrapper',
	group: 'block',
	content: 'table',
	draggable: true,

	parseHTML() {
		return [{ tag: 'table-wrapper' }]
	},

	renderHTML({ HTMLAttributes }) {
		return ['table-wrapper', mergeAttributes(HTMLAttributes), 0]
	},

	addNodeView() {
		return VueNodeViewRenderer(View, {
			stopEvent: () => {
				return false
			},
		})
	},
})

export default OTableWrapper
