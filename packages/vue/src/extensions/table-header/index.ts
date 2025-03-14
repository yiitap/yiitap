import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TableHeader from '@tiptap/extension-table-header'
import type { TableHeaderOptions } from '@tiptap/extension-table-header'

import View from './view.vue'

const OTableHeader = TableHeader.extend<TableHeaderOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      background: {
        default: '',
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(View, {
      stopEvent: () => false,
    })
  },
})

export default OTableHeader
