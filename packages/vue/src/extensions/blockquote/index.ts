import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Blockquote from '@tiptap/extension-blockquote'
import type { BlockquoteOptions } from '@tiptap/extension-blockquote'

import View from './view.vue'

const OBlockquote = Blockquote.extend<BlockquoteOptions>({
	draggable: true,

	addNodeView() {
		return VueNodeViewRenderer(View)
	},
})

export default OBlockquote
