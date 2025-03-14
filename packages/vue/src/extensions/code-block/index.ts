/**
 * Code Block
 *
 * lowlight: https://github.com/wooorm/lowlight
 * highlight: https://github.com/highlightjs/highlight.js
 * styles: https://github.com/highlightjs/highlight.js/tree/main/src/styles
 * demo: https://highlightjs.org/demo
 */
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import type { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

import View from './view.vue'

const CustomCodeBlock = CodeBlockLowlight.extend<CodeBlockLowlightOptions>({
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      wrap: {
        default: true,
        rendered: false,
      },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(View)
  },
}).configure({
  languageClassPrefix: 'language-',
  defaultLanguage: 'bash',
  lowlight,
})

export default CustomCodeBlock
