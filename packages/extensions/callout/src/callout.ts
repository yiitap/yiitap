import { Node, mergeAttributes, InputRule } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>
  triggerCharacters: string[]
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
      triggerCharacters: ['?', '？'],
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

  addInputRules() {
    const { triggerCharacters } = this.options
    const escaped = triggerCharacters
      .map((ch) => ch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('')
    const regexp = new RegExp(`^[${escaped}]\\s$`)

    return [
      new InputRule({
        find: regexp,
        handler: ({ state, range }) => {
          const { tr, schema } = state
          const { $from } = tr.selection
          const blockStart = $from.before($from.depth)
          const blockEnd = $from.after($from.depth)

          // Remove trigger character and space
          tr.delete(range.from, range.to)

          // Create a callout node
          const calloutNode = schema.nodes.callout.create(
            null,
            schema.nodes.paragraph.create()
          )

          // Replace current node to blockquote
          tr.replaceRangeWith(blockStart, blockEnd, calloutNode)

          // Selection
          const selection = TextSelection.near(tr.doc.resolve(blockStart + 2))
          tr.setSelection(selection)
        },
      }),
    ]
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
      'Mod-Shift-c': () => this.editor.commands.toggleCallout(),
    }
  },
})
