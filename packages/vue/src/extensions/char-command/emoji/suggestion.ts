import tippy, { type Instance, type Props } from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import View from './view.vue'
import type { Editor } from '@tiptap/core'
import { filterEmojiGroups } from '../../../constants/emoji'

export interface SuggestionOptions {
	editor: Editor
	event: KeyboardEvent
	clientRect?: (() => DOMRect | null) | null
}

export default {
	items: ({ query }: { query: string }) => {
		return filterEmojiGroups(query)
	},
	render: () => {
		let component: VueRenderer
		let popup: Instance<Props>[]

		return {
			onStart: (props: SuggestionOptions) => {
				component = new VueRenderer(View, {
					props,
					editor: props.editor,
				})

				popup = tippy('body', {
					getReferenceClientRect: props.clientRect,
					appendTo: () => document.body,
					content: component.element,
					showOnCreate: true,
					interactive: true,
					trigger: 'manual',
					placement: 'bottom-start',
					arrow: false,
					onShow(instance) {
						instance.popper.classList.add('emoji-tippy')
					},
				})
			},

			onUpdate(props: SuggestionOptions) {
				component.updateProps(props)

				popup[0].setProps({
					getReferenceClientRect: props.clientRect,
				})
			},

			onKeyDown(props: SuggestionOptions) {
				// console.log('down', props.event)
				if (props.event.key === 'Escape') {
					popup[0].hide()
					component.destroy()

					return true
				}

				return component.ref?.onKeyDown(props)
			},

			onExit() {
				popup[0].destroy()
				component.destroy()
			},
		}
	},
}
