import { Editor, Extension } from '@tiptap/core'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface InlinePlaceholderMeta {
  type: string
  label?: string
  pos: number
}

export interface PlaceholderOptions {
  emptyEditorClass: string
  emptyNodeClass: string
  placeholder:
    | ((PlaceholderProps: {
        editor: Editor
        node: ProsemirrorNode
        pos: number
        hasAnchor: boolean
      }) => string)
    | string
  showOnlyWhenEditable: boolean
  showOnlyCurrent: boolean
  includeChildren: boolean

  // inline placeholder
  onShowInline?: (payload: {
    type: string
    pos: number
    rect?: DOMRect
  }) => void
  onHideInline?: () => void
}

export const InlinePlaceholderKey = new PluginKey('inlinePlaceholder')

export const Placeholder = Extension.create<PlaceholderOptions>({
  name: 'placeholder',

  addOptions() {
    return {
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-empty',
      placeholder: 'Write something …',
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: false,
      onShowInline: (payload: InlinePlaceholderMeta) => {},
      onHideInline: () => {},
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('placeholder'),
        props: {
          decorations: (state) => {
            const { doc, selection, tr } = state
            const active =
              this.editor.isEditable || !this.options.showOnlyWhenEditable
            const { anchor } = selection
            const decorations: Decoration[] = []

            // 如果 inline 占位符存在，则节点占位符隐藏
            const inlineState = InlinePlaceholderKey.getState(state) as {
              active: any
            }
            if (inlineState?.active) return null

            if (!active) {
              return null
            }

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize
              const isEmpty = !node.isLeaf && !node.childCount
              const showOnlyCurrent = this.options.showOnlyCurrent
              if ((hasAnchor || !showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass]

                if (this.editor.isEmpty) {
                  classes.push(this.options.emptyEditorClass)
                }

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(' '),
                  'data-placeholder':
                    typeof this.options.placeholder === 'function'
                      ? this.options.placeholder({
                          editor: this.editor,
                          node,
                          pos,
                          hasAnchor,
                        })
                      : this.options.placeholder,
                })

                decorations.push(decoration)
              }

              return this.options.includeChildren
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
      new Plugin({
        key: InlinePlaceholderKey,
        state: {
          init: () => ({ active: null as InlinePlaceholderMeta | null }),

          apply: (tr, prev) => {
            const meta = tr.getMeta(InlinePlaceholderKey)
            if (meta) console.log('apply', meta)
            if (meta?.type === 'show') return { active: meta.payload }
            if (meta?.type === 'hide') return { active: null }
            return prev
          },
        },
        props: {
          decorations: (state) => {
            const pluginState = InlinePlaceholderKey.getState(state) as {
              active: InlinePlaceholderMeta | null
            }
            const active = pluginState?.active
            if (!active) return null
            console.log('decorations active', active)

            const deco = Decoration.widget(active.pos, () => {
              const span = document.createElement('span')
              span.className = 'inline-placeholder'
              span.textContent = active.label || 'Type...'

              span.addEventListener('click', () => {
                this.options.onShowInline!(active)
              })
              return span
            })

            return DecorationSet.create(state.doc, [deco])
          },
        },
        view: () => ({
          destroy: this.options.onHideInline,
        }),
      }),
    ]
  },
})
