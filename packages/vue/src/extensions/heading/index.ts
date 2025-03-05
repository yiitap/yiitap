import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Heading from '@tiptap/extension-heading'
import View from './view.vue'

export type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingOptions {
	levels: Level[]
	HTMLAttributes: Record<string, any>
}

const OHeading = Heading.extend<HeadingOptions>({
	draggable: true,

	addNodeView() {
		return VueNodeViewRenderer(View)
	},
})

export default OHeading
