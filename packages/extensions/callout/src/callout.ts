import { Node, mergeAttributes } from '@tiptap/core'

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

export interface CalloutOptions {
	HTMLAttributes: Record<string, any>
}

export const Callout = Node.create<CalloutOptions>({
	name: 'callout',
	group: 'block',
	content: 'block+',
	draggable: true,

	addOptions() {
		return {
			HTMLAttributes: {},
		}
	},

	addAttributes() {
		return {
			icon: {
				default: '🌾',
			},
			borderColor: {
				default: '#dddddd',
			},
			background: {
				default: '#eeeeee',
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
})
