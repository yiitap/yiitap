import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { TableWrapper } from '@yiitap/extension-table-wrapper'

import View from './view.vue'

const OTableWrapper = TableWrapper.extend({
  addNodeView() {
    return VueNodeViewRenderer(View, {
      stopEvent: () => {
        return false
      },
    })
  },
})

export default OTableWrapper
