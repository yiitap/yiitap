<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    tippy-class="o-emoji-popover"
    placement="bottom"
    trigger="click"
    arrow
  >
    <template #trigger>
      <o-command-btn
        icon="emoji_emotions"
        content-class="o-emoji-btn"
        :tooltip="tr('editor.emoji')"
      >
      </o-command-btn>
    </template>

    <o-emoji-select :items="emojiGroups" @select="onSelect" enable-search />
  </o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { OCommandBtn, OPopover, OEmojiSelect } from '../index'
// import { emojiGroups } from '../../constants/emoji'
import { emojiGroups } from '@yiitap/util-emoji'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  editor: {
    type: Object,
  },
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref(null)

function onSelect(options: Indexable) {
  popover.value?.setShow(false)
  run(props.editor as Editor, 'content', { content: options.emoji })
}
</script>

<style lang="scss">
.o-emoji-btn {
}
</style>
