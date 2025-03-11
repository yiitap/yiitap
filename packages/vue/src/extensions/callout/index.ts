import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Callout from "@yiitap/extension-callout";
import type { CalloutOptions } from "@yiitap/extension-callout";
import View from './view.vue'

const OCallout = Callout
  .extend<CalloutOptions>({
  addNodeView() {
    return VueNodeViewRenderer(View)
  },
});

export default OCallout
