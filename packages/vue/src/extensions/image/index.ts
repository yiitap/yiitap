import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Image from '@yiitap/extension-image'
import type { ImageOptions } from '@yiitap/extension-image'

import View from './view.vue'

const OImage = Image.extend<ImageOptions>({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
}).configure({
  inline: true,
})

export default OImage
