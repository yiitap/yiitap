import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TableCell from '@tiptap/extension-table-cell'
import type { TableCellOptions } from '@tiptap/extension-table-cell'

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
