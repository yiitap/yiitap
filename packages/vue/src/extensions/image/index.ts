import { mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import type { ImageOptions } from '@tiptap/extension-image'

import View from './view.vue'

const OImage = Image.extend<ImageOptions>({
	draggable: true,
	addAttributes() {
		return {
			...this.parent?.(),
			size: {
				default: '',
				rendered: false,
			}, // small, medium, large
			ratio: {
				default: '',
				rendered: false,
			},
			isDraggable: {
				default: true,
				renderHTML: (attributes) => {
					return {}
				},
			},
		}
	},
	renderHTML({ node, HTMLAttributes }) {
		HTMLAttributes.size = node.attrs.size
		HTMLAttributes.ratio = node.attrs.ratio

		return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
	},
	addNodeView() {
		return VueNodeViewRenderer(View)
	},
}).configure({
	inline: true,
})

export default OImage
