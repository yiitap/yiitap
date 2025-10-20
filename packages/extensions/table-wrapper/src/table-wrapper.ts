import {
  mergeAttributes,
  Node,
  type MarkdownToken,
  type JSONContent,
} from '@tiptap/core'
import { renderTableToMarkdown } from '@tiptap/extension-table'

export const TableWrapper = Node.create({
  name: 'table-wrapper',
  group: 'block',
  content: 'table',
  draggable: true,

  parseHTML() {
    return [{ tag: 'table-wrapper' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['table-wrapper', mergeAttributes(HTMLAttributes), 0]
  },

  renderMarkdown: (node, h) => {
    if (node.content && node.content.length) {
      return renderTableToMarkdown(node.content[0], h)
    } else {
      return ''
    }
  },
})
