import { Extension } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'

export interface ShortcutOptions {
  duplicate?: {
    enabled?: boolean
    keys?: string[] // e.g. ['Mod-d']
  }
  delete?: {
    enabled?: boolean
    keys?: string[] // e.g. ['Mod-x']
  }
  nodes: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nodeShortcut: {
      /** Duplicate current node */
      duplicateNode: () => ReturnType
      /** Delete current node */
      deleteNode: () => ReturnType
    }
  }
}

export const Shortcut = Extension.create<ShortcutOptions>({
  name: 'shortcut',

  addOptions() {
    return {
      duplicate: { enabled: true, keys: ['Mod-d'] },
      delete: { enabled: true, keys: ['Mod-x'] },
      nodes: [
        'aiBlock',
        'blockquote',
        'callout',
        'codeBlock',
        'heading',
        'listItem',
        'paragraph',
        'tableCell',
        'tableHeader',
        'taskItem',
      ],
    }
  },

  addCommands() {
    return {
      duplicateNode:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { node, $from } = selection as any

          // 若选中的是整个节点
          if (node) {
            const pos = $from.before()
            const clone = node.type.create(node.attrs, node.content, node.marks)
            if (dispatch) {
              tr.insert(pos + node.nodeSize, clone)
              dispatch(tr.scrollIntoView())
            }
            return true
          }

          // 若仅在节点内部（未选中整个节点）
          // 找到最外层节点
          const depth = $from.depth
          const pos = $from.before(depth)
          const targetNode = $from.node(depth)
          if (!targetNode) return false

          const clone = targetNode.type.create(
            targetNode.attrs,
            targetNode.content,
            targetNode.marks
          )

          if (dispatch) {
            tr.insert(pos + targetNode.nodeSize, clone)
            dispatch(tr.scrollIntoView())
          }

          return true
        },

      deleteNode:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { $from } = selection

          // 找到最外层块级节点（非 text、inline）
          let depth = $from.depth
          let targetDepth = depth
          for (; depth > 0; depth--) {
            const node = $from.node(depth)
            if (node.isBlock) {
              targetDepth = depth
              break
            }
          }

          const node = $from.node(targetDepth)
          if (!node) return false

          const pos = $from.before(targetDepth)
          const end = pos + node.nodeSize

          // write to clipboard
          try {
            const json = node.toJSON()
            const text = JSON.stringify({ __tiptap_node__: true, node: json })
            navigator.clipboard.writeText(text).catch(() => {})
          } catch (err) {
            console.warn('Clipboard write failed:', err)
          }

          // delete node
          if (dispatch) {
            tr.delete(pos, end)
            dispatch(tr.scrollIntoView())
          }
          return true
        },
    }
  },

  addKeyboardShortcuts() {
    const shortcuts: Record<string, (props: { editor: any }) => boolean> = {}

    // Duplicate a node
    if (this.options.duplicate?.enabled) {
      const keys = this.options.duplicate.keys ?? ['Mod-d']
      for (const key of keys) {
        shortcuts[key] = ({ editor }) => editor.commands.duplicateNode()
      }
    }

    // Delete a node
    if (this.options.delete?.enabled) {
      const keys = this.options.delete.keys ?? ['Mod-x']
      for (const key of keys) {
        shortcuts[key] = ({ editor }) => editor.commands.deleteNode()
      }
    }

    // Select all
    // Mod-a once: select inside node
    // Mod-a twice: select all doc
    shortcuts['Mod-a'] = ({ editor }) => {
      const { state, view } = editor
      const { selection, tr } = state
      const { $from } = selection
      const node = $from.node(-1)
      // console.log('select node:', node?.type.name)

      // New selection
      let start = -1
      let end = -1

      if (this.options.nodes.includes(node?.type.name)) {
        start = $from.start(-1) + 1
        end = $from.end(-1) - 1
      } else if (node?.type.name === 'doc') {
        // codeBlock
        let depth = $from.depth
        let newNode = null
        let pos = 0

        while (depth > 0) {
          const candidate = $from.node(depth)
          if (candidate.isBlock) {
            newNode = candidate
            pos = $from.before(depth)
            break
          }
          depth--
        }
        // console.log('select newNode: doc', newNode?.type.name)

        if (this.options.nodes.includes(newNode?.type.name)) {
          start = pos + 1
          end = pos + newNode?.nodeSize - 1
        }
      }

      if (start > -1 && end > -1) {
        const { from, to } = selection
        if (from !== start || to !== end) {
          const newSelection = TextSelection.create(tr.doc, start, end)
          tr.setSelection(newSelection)
          view.dispatch(tr)
          return true
        }
      }

      return false
    }

    return shortcuts
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event, slice) => {
            const clipboardData = event.clipboardData
            if (!clipboardData) return false

            const text = clipboardData.getData('text/plain')
            if (!text) return false

            try {
              const parsed = JSON.parse(text)
              if (parsed.__tiptap_node__ && parsed.node) {
                const nodeJSON = parsed.node as ProseMirrorNode
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    this.editor.schema.nodeFromJSON(nodeJSON)
                  )
                )
                return true
              }
            } catch {
              console.warn('Parsed failed.')
            }

            return false // fallback to default paste
          },
        },
      }),
    ]
  },
})
