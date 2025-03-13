/**
 * see https://tiptap.dev/api/nodes/emoji
 */
import type { Editor, Range } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'

export default Extension.create({
	name: 'slash',

	addOptions() {
		return {
			key: 'slash',
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
				pluginKey: new PluginKey(this.options.key),
				editor: this.editor,
				...this.options.suggestion,
			}),
		]
	},
})
