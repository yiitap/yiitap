/**
 * see https://tiptap.dev/api/nodes/emoji
 */
import type { Editor, Range } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'

export const SlashCommand = Extension.create({
	name: 'slash-command',

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
				pluginKey: new PluginKey('slash-command'),
				editor: this.editor,
				...this.options.suggestion,
			}),
		]
	},
})
