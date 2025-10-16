import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { InputRule } from '@tiptap/core'
import { Details } from '@tiptap/extension-details'
import type { DetailsOptions } from '@tiptap/extension-details'
import { TextSelection } from '@tiptap/pm/state'

import View from './view.vue'

interface ODetailsOptions extends DetailsOptions {
  triggerCharacters: string[]
}

const ODetails = Details.extend<ODetailsOptions>({
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

          // Create a details node
          const detailsNode = schema.nodes.details.create(null, [
            schema.nodes.detailsSummary.create(null),
            schema.nodes.detailsContent.create(
              null,
              schema.nodes.paragraph.create()
            ),
          ])

          // Replace current node to blockquote
          tr.replaceRangeWith(blockStart, blockEnd, detailsNode)

          // Selection
          const selection = TextSelection.near(tr.doc.resolve(blockStart + 2))
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

export default ODetails
