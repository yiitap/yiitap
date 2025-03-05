import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Paragraph from '@tiptap/extension-paragraph'

import View from './view.vue'

const OParagraph = Paragraph.extend({
	draggable: false,

	addNodeView() {
		return VueNodeViewRenderer(View, {
			stopEvent: () => false,
		})
	},
})
export default OParagraph
