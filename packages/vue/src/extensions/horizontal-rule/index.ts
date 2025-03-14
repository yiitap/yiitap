import { VueNodeViewRenderer } from '@tiptap/vue-3'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

import View from './view.vue'

const OHorizontalRule = HorizontalRule.extend({
  draggable: true,

  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export default OHorizontalRule
