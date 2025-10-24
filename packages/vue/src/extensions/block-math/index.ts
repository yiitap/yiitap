import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { BlockMath, type BlockMathOptions } from '@tiptap/extension-mathematics'

import View from './view.vue'

const OBlockMath = BlockMath.extend<BlockMathOptions>({
  addCommands() {
    return {
      insertBlockMath:
        (options: { latex?: string } = {}) =>
        ({ tr, dispatch, state }) => {
          const node = state.schema.nodes.blockMath.create({
            latex: options.latex ?? '', // 👈 Empty string is allowed
          })
          if (dispatch) {
            tr.replaceSelectionWith(node)
            tr.scrollIntoView()
          }
          return true
        },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export default OBlockMath
