import TipTapLink from '@tiptap/extension-link'
import { clickSelectHandler } from './helpers/clickSelectHandler'

export const Link = TipTapLink.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      clickSelectHandler({
        type: this.type,
      }),
    ]
  },
})
