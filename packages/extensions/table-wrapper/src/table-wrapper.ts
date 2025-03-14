import { mergeAttributes, Node } from '@tiptap/core'

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
})
