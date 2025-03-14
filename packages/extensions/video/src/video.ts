import { Node, nodeInputRule, mergeAttributes } from '@tiptap/core'

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: any) => ReturnType
    }
  }
}

export const Video = Node.create({
  name: 'video',
  draggable: true,

  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  addAttributes() {
    return {
      // small, medium, large
      caption: {
        default: '',
        rendered: false,
      },
      src: {
        default: null,
        parseHTML: (element) => {
          const child = element.firstElementChild as HTMLVideoElement | null
          const src = child?.src ?? ''
          return src
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'video',
      {
        caption: node.attrs.caption,
      },
      ['source', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
    ]
  },

  addCommands() {
    return {
      setVideo:
        (options: any) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [src] = match

          return { src }
        },
      }),
    ]
  },
})
