/**
 * see https://tiptap.dev/api/nodes/emoji
 */
import type { Editor, Range } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

export default Extension.create({
	name: 'slash',

	addOptions() {
		return {
			suggestion: {
				char: '/',
				command: ({
					editor,
					range,
					props,
				}: {
					editor: Editor
					range: Range
					props: any
				}) => {
					props.command({ editor, range })
				},
			},
		}
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
			}),
		]
	},
})
