<template>
  <o-menubar-btn
    class="o-simple-command-btn"
    :icon="command.icon"
    :tooltip="command.tooltip"
    :content-class="{
      'is-active': editor?.isActive(name),
      'rotate-90': command.rotate,
    }"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import OMenubarBtn from '../common/OMenubarBtn.vue'
import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  editor: {
    type: Object,
  },
})
const { run } = useTiptap()
const { tr } = useI18n()

const commands: Indexable = computed(() => {
  return {
    aiViewer: { icon: 'auto_awesome', tooltip: tr('label.ai') },
    blockquote: { icon: 'format_quote_open', tooltip: tr('editor.blockquote') },
    bold: { icon: 'format_bold', tooltip: tr('editor.bold') },
    callout: { icon: 'card_text', tooltip: tr('editor.callout') },
    clearFormat: { icon: 'format_clear', tooltip: tr('editor.removeFormat') },
    code: { icon: 'code', tooltip: tr('editor.code') },
    codeBlock: { icon: 'code_braces', tooltip: tr('editor.codeBlock') },
    columns: {
      icon: 'splitscreen_vertical_add',
      tooltip: 'Column',
      rotate: true,
    },
    // details: { icon: 'toggle_list', tooltip: tr('editor.toggleList') },
    horizontalRule: { icon: 'horizontal_rule', tooltip: tr('editor.hr') },
    italic: { icon: 'format_italic', tooltip: tr('editor.italic') },
    image: { icon: 'image', tooltip: tr('editor.photo') },
    inlineMath: { icon: 'function', tooltip: tr('editor.inlineMath') },
    blockMath: { icon: 'functions', tooltip: tr('editor.blockMath') },
    inlineMathDelete: { icon: 'close', tooltip: tr('editor.delete') },
    linkUnset: { icon: 'link_off', tooltip: tr('link.off') },
    modelViewer: { icon: '3d_rotation', tooltip: tr('label.modelViewer') },
    strike: {
      icon: 'format_strikethrough',
      tooltip: tr('editor.strikethrough'),
    },
    underline: { icon: 'format_underlined', tooltip: tr('editor.underline') },
    video: { icon: 'videocam', tooltip: tr('editor.video') },
    aiBlock: { icon: 'auto_awesome', tooltip: tr('editor.aiBlock') },
  }
})
const command: Indexable = computed(() => {
  return (
    commands.value[props.name] || {
      icon: '',
      isActive: false,
      command: () => {},
    }
  )
})

function onClick() {
  run(props.editor as Editor, props.name)
}
</script>

<style lang="scss">
.o-simple-command-btn {
}
</style>
