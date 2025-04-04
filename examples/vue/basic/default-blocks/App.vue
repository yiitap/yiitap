<template>
  <YiiEditor ref="yiiEditor" v-bind="editorOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { YiiEditor } from '@yiitap/vue'

const initialContent = `
Introduction</h1><h2>Table</h2><table-wrapper><table style="min-width: 340px"><colgroup><col style="width: 290px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1" colwidth="290" background=""><p style="text-align: center">Title</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center">Shortcut</p></th><th colspan="1" rowspan="1" background=""><p style="text-align: center">Remarks</p></th></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Heading</p></td><td colspan="1" rowspan="1" background=""><p><code>#</code> <code>##</code> <code>###</code> <code>####</code> <code>#####</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Blockquote</p></td><td colspan="1" rowspan="1" background=""><p><code>&gt;</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Code</p></td><td colspan="1" rowspan="1" background=""><p><code>\`\`</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="290" background=""><p>Code Block</p></td><td colspan="1" rowspan="1" background=""><p><code>\`\`\`</code></p></td><td colspan="1" rowspan="1" background=""><p></p></td></tr></tbody></table></table-wrapper><p></p>
`

const editorOptions = computed(() => {
  return {
    title: true,
    content: initialContent,
    editable: false,
    pageView: 'full',
    extensions: [
      'OBlockquote',
      'OCallout',
      'OCodeBlock',
      'OColon',
      'OColorHighlighter',
      'OImage',
      'OParagraph',
      'OLink',
      'OVideo',
    ],
  }
})
</script>
