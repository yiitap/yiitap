import { VueNodeViewRenderer } from '@tiptap/vue-3'
import AiBlock from '@yiitap/extension-ai-block'
import type { AiBlockOptions } from '@yiitap/extension-ai-block'
import View from './view.vue'

const OAiBlock = AiBlock.extend<AiBlockOptions>({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
})

export default OAiBlock
