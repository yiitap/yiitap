import { Node, mergeAttributes } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'

export interface AiBlockOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiBlock: {
      /**
       * Set a aiBlock node
       */
      setAiBlock: () => ReturnType
      /**
       * Toggle a aiBlock node
       */
      toggleAiBlock: () => ReturnType
      /**
       * Unset a aiBlock node
       */
      unsetAiBlock: () => ReturnType
      setAiBlockContent: (
        pos: number,
        contentJSON: Record<string, any>
      ) => ReturnType
    }
  }
}

export const AiBlock = Node.create<AiBlockOptions>({
  name: 'aiBlock',
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
      prompt: {
        default: '',
      },
      time: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="aiBlock"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'aiBlock' }),
      0,
    ]
  },

  addCommands() {
    return {
      setAiBlock:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name)
        },
      toggleAiBlock:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name)
        },
      unsetAiBlock:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
      /**
       * Todo: update node's content
       * @param pos
       * @param contentJSON
       */
      setAiBlockContent:
        (pos: number, contentJSON: Record<string, any>) =>
        ({ editor, tr, dispatch }) => {
          const oldNode = tr.doc.nodeAt(pos)
          console.log('oldNode', oldNode)

          if (!oldNode || oldNode.type.name !== this.name) return false

          try {
            const node = ProseMirrorNode.fromJSON(editor.schema, contentJSON)
            const newNode = oldNode.copy(node.content)
            console.log('newNode', newNode)

            tr.replaceWith(pos, pos + oldNode.nodeSize, newNode)
            return dispatch?.(tr)
          } catch (err) {
            console.error('Invalid content structure:', err)
            return false
          }
        },
    }
  },
})
