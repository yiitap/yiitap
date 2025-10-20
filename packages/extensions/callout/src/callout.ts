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

  markdownTokenName: 'callout',

  parseMarkdown: (token, helpers) => {
    const icon = token.info.replace('info', '').trim() || '🌾'
    const content = helpers.parseChildren(token.tokens ?? [])
    console.log('callout parseMarkdown', token.info)
    console.log('callout parseMarkdown', token, content, icon)
    return helpers.createNode('callout', { icon: icon }, content)
  },

  renderMarkdown: (node, h) => {
    if (!node.content) {
      return ''
    }

    const start = `::: info ${node.attrs?.icon || '🌾'}`
    const end = ':::'
    const lines: string[] = []

    // Content
    node.content.forEach((child) => {
      const lineContent = h.renderChildren(child)
      lines.push(lineContent)
    })

    return start + '\n' + lines.join('\n\n') + '\n' + end
  },

  markdownTokenizer: {
    name: 'callout',
    level: 'block',
    start: (src: string) => src.match(/^:::/)?.index ?? -1,
    tokenize(src: string, tokens: any[], lexer: any) {
      const match = /^:::([^\n]+)\n([\s\S]*?)\n:::\s*(?:\n|$)/.exec(src)
      if (!match) return undefined

      const [, info, body] = match
      console.log('markdownTokenizer', src, match, info, body)

      // 解析 body 内部为 block token
      const bodyTokens = lexer.blockTokens(body)

      return {
        type: 'callout',
        raw: match[0],
        info,
        tokens: bodyTokens,
      }
    },
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
