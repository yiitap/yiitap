import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { TableCell } from '@tiptap/extension-table'
import type { TableCellOptions } from '@tiptap/extension-table'

import View from './view.vue'

const OTableCell = TableCell.extend<TableCellOptions>({
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

export default OTableCell
