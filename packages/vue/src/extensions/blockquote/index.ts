import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { InputRule } from '@tiptap/core'
import Blockquote from '@tiptap/extension-blockquote'
import type { BlockquoteOptions } from '@tiptap/extension-blockquote'

import View from './view.vue'

const OBlockquote = Blockquote.extend<BlockquoteOptions>({
  draggable: true,

  addOptions() {
    return {
      ...this.parent?.(),
      /**
       * triggerCharacters
       * default: ['>']
       * custom: ['"', '“', '”']
       */
      triggerCharacters: ['>'],
    }
  },

  addInputRules() {
    const { triggerCharacters } = this.options
    const escaped = triggerCharacters
      .map((ch) => ch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('')
    const regexp = new RegExp(`^[${escaped}]\\s$`)

    return [
      new InputRule({
        find: regexp,
        handler: ({ state, range }) => {
          const { tr, schema } = state
          const { $from } = tr.selection
          const blockStart = $from.before($from.depth)
          const blockEnd = $from.after($from.depth)

          // Remove trigger character and space
          tr.delete(range.from, range.to)

          // Create a blockquote node
          const blockquote = schema.nodes.blockquote.create(
            null,
            schema.nodes.paragraph.create()
          )

          // Replace current node to blockquote
          tr.replaceRangeWith(blockStart, blockEnd, blockquote)

          // Selection
          const selection = state.selection.constructor.near(
            tr.doc.resolve(blockStart + 2)
          )
          tr.setSelection(selection)

          return tr
        },
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export default OBlockquote
