import { mergeAttributes } from '@tiptap/core'
import { default as TiptapImage } from '@tiptap/extension-image'
import type { ImageOptions } from '@tiptap/extension-image'

export const Image = TiptapImage.extend<ImageOptions>({
  draggable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: '',
        rendered: false,
      }, // small, medium, large
      ratio: {
        default: '',
        rendered: false,
      },
      isDraggable: {
        default: true,
        renderHTML: (attributes) => {
          return {}
        },
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    HTMLAttributes.size = node.attrs.size
    HTMLAttributes.ratio = node.attrs.ratio

    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },
})

export { ImageOptions }
