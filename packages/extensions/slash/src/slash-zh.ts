import { Editor, Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'

export const SlashZh = Extension.create({
	name: 'slash-zh',

	addOptions() {
		return {
			suggestion: {
				char: '、',
				command: ({
					editor,
					range,
					props,
				}: {
					editor: Editor
					range: any
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
				pluginKey: new PluginKey('slash-zh-suggestion'),
				editor: this.editor,
				...this.options.suggestion,
			}),
		]
	},
})
