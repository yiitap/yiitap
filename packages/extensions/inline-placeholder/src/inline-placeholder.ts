import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface InlinePlaceholderMeta {
  type: string
  label?: string
  pos: number
}

export const InlinePlaceholderKey = new PluginKey('inlinePlaceholderPlugin')

export const InlinePlaceholder = Extension.create({
  name: 'inlinePlaceholder',

  addOptions() {
    return {
      onShow: (payload: InlinePlaceholderMeta) => {},
      onHide: () => {},
    }
  },

  addProseMirrorPlugins() {
    return [
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
              span.className =
                'inline-placeholder bg-gray-100 border border-gray-300 text-gray-500 px-1 rounded cursor-text'
              span.textContent = active.label || 'Type...'

              span.addEventListener('click', () => {
                this.options.onShow(active)
              })
              return span
            })

            return DecorationSet.create(state.doc, [deco])
          },
        },
        view: () => ({
          destroy: this.options.onHide,
        }),
      }),
    ]
  },
})
