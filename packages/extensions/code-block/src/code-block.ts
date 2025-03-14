/**
 * Code Block
 *
 * lowlight: https://github.com/wooorm/lowlight
 * highlight: https://github.com/highlightjs/highlight.js
 * styles: https://github.com/highlightjs/highlight.js/tree/main/src/styles
 * demo: https://highlightjs.org/demo
 */
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import type { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight'

export const CodeBlock = CodeBlockLowlight.extend<CodeBlockLowlightOptions>({
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
})
