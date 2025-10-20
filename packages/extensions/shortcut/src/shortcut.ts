import { Extension } from '@tiptap/core'
import { Markdown } from '@tiptap/markdown'
import { Node as ProseMirrorNode, Fragment, Slice } from '@tiptap/pm/model'
import {
  Plugin,
  PluginKey,
  NodeSelection,
  TextSelection,
} from '@tiptap/pm/state'

import { isMarkdown, jsonToMarkdown, jsonToHTML, htmlToJSON } from './util'

type Indexable<T = any> = {
  [key: string]: T
}

export interface ShortcutOptions {
  copy?: {
    enabled?: boolean
    keys?: string[] // e.g. ['Mod-x']
  }
  duplicate?: {
    enabled?: boolean
    keys?: string[] // e.g. ['Mod-d']
  }
  delete?: {
    enabled?: boolean
    keys?: string[] // e.g. ['Mod-x']
  }
  markdown?: {
    enabled?: boolean
  }
  selectableNodes: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    shortcut: {
      /** Copy selected nodes */
      copySelected: () => ReturnType
      /** Duplicate selected nodes */
      duplicateSelected: () => ReturnType
      /** Delete selected node */
      deleteSelected: (option?: { delete?: boolean }) => ReturnType
    }
  }
}

export const Shortcut = Extension.create<ShortcutOptions>({
  name: 'shortcut',

  addOptions() {
    return {
      copy: { enabled: true, keys: ['Mod-c'] },
      duplicate: { enabled: true, keys: ['Mod-d'] },
      delete: { enabled: true, keys: ['Mod-x'] },
      markdown: { enabled: false },
      selectableNodes: [
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
      copySelected:
        () =>
        ({ tr, state, dispatch }) => {
          return this.editor.commands.deleteSelected({ delete: false })
        },

      duplicateSelected:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { $from, $to } = selection as any

          // 1. Select a single node
          if (selection instanceof NodeSelection) {
            const node = selection.node
            const pos = selection.to
            const clone = node.type.create(node.attrs, node.content, node.marks)
            if (dispatch) {
              const tr = state.tr.insert(pos, clone)
              dispatch(tr.scrollIntoView())

              setTimeout(() => {
                this.editor.commands.setNodeSelection(pos)
              }, 100)
            }
            return true
          }

          // 2. Select multiple nodes
          if (!selection.empty) {
            const { from, to } = selection
            const slice = state.doc.slice(from, to)
            const insertPos = to // 复制后插入在选区后面

            if (dispatch) {
              let tr = state.tr.insert(insertPos, slice.content)
              const insertedSize = slice.content.size

              // Select inserted content
              tr = tr.setSelection(
                TextSelection.create(
                  tr.doc,
                  insertPos,
                  insertPos + insertedSize
                )
              )
              dispatch(tr.scrollIntoView())
            }
            return true
          }

          // 3. Select none, duplicate the cursor node
          const depth = $from.depth
          const pos = $from.before(depth)
          const node = $from.node(depth)
          if (!node) return false

          const clone = node.type.create(node.attrs, node.content, node.marks)

          if (dispatch) {
            const insertPos = pos + node.nodeSize
            let tr = state.tr.insert(insertPos, clone)

            // Place the cursor to the end of the new node.
            const cursorPos = insertPos + node.nodeSize - 1
            tr = tr.setSelection(TextSelection.create(tr.doc, cursorPos))
            dispatch(tr.scrollIntoView())
          }

          return true
        },

      deleteSelected:
        (option: { delete?: boolean } = { delete: true }) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { $from, from, to } = selection

          // 1. Delete selected
          if (from !== to) {
            // Copy to clipboard
            try {
              const slice = state.doc.slice(from, to)
              const json = slice.content.toJSON()
              const html = jsonToHTML(json, this.editor)
              const writeData: Indexable = {
                'text/html': new Blob([html], { type: 'text/html' }),
              }

              if (this.options.markdown?.enabled) {
                const markdown = jsonToMarkdown(json, this.editor) || ''
                writeData['text/plain'] = new Blob([markdown], {
                  type: 'text/plain',
                })
              }

              const item = new ClipboardItem(writeData)
              navigator.clipboard.write([item])
              console.log('Selected data: ', writeData)
            } catch (err) {
              console.error('Clipboard write failed.', err)
            }

            // Delete
            if (option.delete && dispatch) {
              tr.deleteRange(from, to)
              dispatch(tr.scrollIntoView())
            }
            return true
          }

          // 2. Delete cursor node
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

          // Copy to clipboard
          try {
            const json = node.toJSON()
            const html = jsonToHTML(json, this.editor)
            const writeData: Indexable = {
              'text/html': new Blob([html], { type: 'text/html' }),
            }

            if (this.options.markdown?.enabled) {
              const markdown = jsonToMarkdown(json, this.editor) || ''
              writeData['text/plain'] = new Blob([markdown], {
                type: 'text/plain',
              })
            }

            const item = new ClipboardItem(writeData)
            navigator.clipboard.write([item])
            console.log('Selected data: ', writeData)
          } catch (err) {
            console.error('Clipboard write failed.', err)
          }

          // delete node
          if (option.delete && dispatch) {
            tr.delete(pos, end)
            dispatch(tr.scrollIntoView())
          }
          return true
        },
    }
  },

  addKeyboardShortcuts() {
    const shortcuts: Record<string, (props: { editor: any }) => boolean> = {}

    // Copy selected nodes
    if (this.options.copy?.enabled) {
      const keys = this.options.copy.keys ?? ['Mod-c']
      for (const key of keys) {
        shortcuts[key] = ({ editor }) => editor.commands.copySelected()
      }
    }

    // Duplicate selected nodes
    if (this.options.duplicate?.enabled) {
      const keys = this.options.duplicate.keys ?? ['Mod-d']
      for (const key of keys) {
        shortcuts[key] = ({ editor }) => editor.commands.duplicateSelected()
      }
    }

    // Delete selected node
    if (this.options.delete?.enabled) {
      const keys = this.options.delete.keys ?? ['Mod-x']
      for (const key of keys) {
        shortcuts[key] = ({ editor }) => editor.commands.deleteSelected()
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

      if (this.options.selectableNodes.includes(node?.type.name)) {
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

        if (this.options.selectableNodes.includes(newNode?.type.name)) {
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

            const html = clipboardData.getData('text/html')
            const text = clipboardData.getData('text/plain')
            if (!html && !text) return false
            console.log('paste html: ', html)
            console.log('paste text: ', text)

            // Paste html
            if (html) {
              try {
                const json = htmlToJSON(html, this.editor)
                const fragment = Fragment.fromJSON(
                  view.state.schema,
                  json.content
                )
                // console.log('Parsed html: ', html, json, fragment)
                const slice = new Slice(fragment, 0, 0)
                const tr = view.state.tr.replaceSelection(slice)
                view.dispatch(tr.scrollIntoView())
                return true
              } catch (err) {
                console.error('Parse html failed.', err)
              }
            }

            // Paste markdown
            if (this.options.markdown?.enabled) {
              if (isMarkdown(text)) {
                try {
                  const json = this.editor.markdown?.parse(text) || {}
                  console.log('Pasted markdown: ', text, json)
                  const content = json?.content
                  const fragment = Fragment.fromJSON(view.state.schema, content)
                  const slice = new Slice(fragment, 0, 0)
                  const tr = view.state.tr.replaceSelection(slice)
                  view.dispatch(tr.scrollIntoView())
                  return true
                } catch (err) {
                  console.error('Parse Markdown failed.', err)
                }
              }
            }

            // fallback to default paste
            return false
          },
        },
      }),
    ]
  },
})
