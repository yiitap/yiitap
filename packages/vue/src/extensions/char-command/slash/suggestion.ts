import tippy, { type Instance, type Props } from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import View from './view.vue'
import { Blocks } from '../../../constants/block'
import {
  type SuggestionProps,
  type SuggestionKeyDownProps,
} from '@tiptap/suggestion'
import { type MentionNodeAttrs } from '@tiptap/extension-mention'

export default {
  items: ({ query }: { query: string }) => {
    return Blocks.filter(
      (item) =>
        item.value.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords?.toLowerCase().includes(query.toLowerCase())
    )
  },
  render: () => {
    let component: VueRenderer
    let popup: Instance<Props>[]

    return {
      onStart: (props: SuggestionProps<any, MentionNodeAttrs>) => {
        component = new VueRenderer(View, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          arrow: false,
          onShow: (instance) => {
            instance.popper.classList.add('slash-tippy')
          },
        })
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
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
