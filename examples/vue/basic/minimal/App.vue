<template>
  <YiiEditor ref="yiiEditor" v-bind="editorOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { YiiEditor } from '@yiitap/vue'

const editorOptions = computed(() => {
  return {
    content: '',
    autofocus: true,
    showBubbleMenu: true,
    showSideMenu: true,
    pageView: 'page',
    extensions: [
      'OAiBlock',
      'OBlockquote',
      'OCallout',
      'OCodeBlock',
      'OColon',
      'OColorHighlighter',
      'OHeading',
      'OImage',
      'OParagraph',
      'OSlash',
      'OSlashZh',
      'OLink',
      'OTrailingNode',
      'OVideo',
    ],
  }
})
</script>
