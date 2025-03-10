import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import View from './view.vue'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		callout: {
			/**
			 * Set a callout node
			 */
			setCallout: () => ReturnType
			/**
			 * Toggle a callout node
			 */
			toggleCallout: () => ReturnType
			/**
			 * Unset a callout node
			 */
			unsetCallout: () => ReturnType
		}
	}
}

export default Node.create({
	name: 'callout',
	group: 'block',
	content: 'block+',
	draggable: true,

	addAttributes() {
		return {
			icon: {
				default: '🌾',
			},
			borderColor: {
				default: '#dddddd',
			},
			borderColorDark: {
				default: '#333333',
			},
			backColor: {
				default: '#eeeeee',
			},
			backColorDark: {
				default: 'rgba(101, 117, 133, 0.16)',
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="callout"]',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }),
			0,
		]
	},

	addCommands() {
		return {
			setCallout:
				() =>
				({ commands }) => {
					return commands.wrapIn(this.name)
				},
			toggleCallout:
				() =>
				({ commands }) => {
					return commands.toggleWrap(this.name)
				},
			unsetCallout:
				() =>
				({ commands }) => {
					return commands.lift(this.name)
				},
		}
	},

	addNodeView() {
		return VueNodeViewRenderer(View)
	},
})
