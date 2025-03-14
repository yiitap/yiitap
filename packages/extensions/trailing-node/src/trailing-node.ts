import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Node as ProseMirrorNode, NodeType } from '@tiptap/pm/model'

function isDisabledNode({
  node,
  types,
}: {
  node: ProseMirrorNode
  types: NodeType[] | NodeType
}) {
  return (
    (Array.isArray(types) && types.includes(node.type)) || node.type === types
  )
}

function shouldInsert({
  node,
  types,
}: {
  node: ProseMirrorNode | null
  types: NodeType[]
}) {
  if (!node) return false
  return !isDisabledNode({ node, types })
}

export const TrailingNode = Extension.create({
  name: 'trailingNode',

  addOptions() {
    return {
      node: 'paragraph',
      notAfter: ['paragraph'],
    }
  },

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)
    const disabledNodes = Object.entries(this.editor.schema.nodes)
      .map(([, value]) => value)
      .filter((node) => this.options.notAfter.includes(node.name))

    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state
          const shouldInsertNodeAtEnd = plugin.getState(state)
          const endPosition = doc.content.size
          const type = schema.nodes[this.options.node]

          if (!shouldInsertNodeAtEnd || !type) return
          // console.log('append', type)

          return tr.insert(endPosition, type.create())
        },
        state: {
          init: (_, state) => {
            const lastChild = state.tr.doc.lastChild
            const lastChildContent = lastChild?.firstChild ?? null
            // console.log('init', lastChild?.type.name, lastChildContent?.type.name)

            return (
              shouldInsert({ node: lastChild, types: disabledNodes }) ||
              shouldInsert({ node: lastChildContent, types: disabledNodes })
            )
          },
          apply: (tr, value) => {
            if (!tr.docChanged) return value

            const lastChild = tr.doc.lastChild
            const lastChildContent = tr.doc.lastChild?.firstChild ?? null

            return (
              shouldInsert({ node: lastChild, types: disabledNodes }) ||
              shouldInsert({ node: lastChildContent, types: disabledNodes })
            )
          },
        },
      }),
    ]
  },
})
