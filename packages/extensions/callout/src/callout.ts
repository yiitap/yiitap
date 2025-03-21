import { Node, mergeAttributes } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Set a callout node
       */
      setCallout: () => ReturnType
      /**
       * Toggle a callout node
       */
      toggleCallout: () => ReturnType
      /**
       * Unset a callout node
       */
      unsetCallout: () => ReturnType
    }
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',
  group: 'block',
  content: 'block+',
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      icon: {
        default: '🌾',
      },
      borderColor: {
        default: '#dddddd',
      },
      borderColorDark: {
        default: '#333333',
      },
      backColor: {
        default: '#eeeeee',
      },
      backColorDark: {
        default: 'rgba(101, 117, 133, 0.16)',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }),
      0,
    ]
  },

  addCommands() {
    return {
      setCallout:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name)
        },
      toggleCallout:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name)
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-a': ({ editor }) => {
        const { state, view } = editor
        const { selection, tr } = state
        const { $from } = selection
        const node = $from.node(-1) // Get current node（-1 表示获取最近的块级节点）

        if (node?.type.name === this.name) {
          // Compute the selection of inner aiBlock
          const start = $from.start(-1) + 1
          const end = $from.end(-1) - 1
          const newSelection = TextSelection.create(tr.doc, start, end)

          // Apply select
          tr.setSelection(newSelection)
          view.dispatch(tr)
          return true // Prevents the default behavior
        }

        return false // Use default behavior
      },
    }
  },
})
