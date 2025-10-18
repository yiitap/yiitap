<template>
  <o-menubar-btn
    class="o-details-btn"
    icon="toggle_list"
    :tooltip="tr('editor.toggleList')"
    :content-class="{
      'is-active': editor?.isActive('details'),
    }"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Editor } from '@tiptap/core'
import OMenubarBtn from '../common/OMenubarBtn.vue'
import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
  },
})
const { run } = useTiptap()
const { tr } = useI18n()

function onClick() {
  const { state } = props.editor
  const { selection } = state
  const { $from } = selection

  const node = $from.node()
  const nodeType = node.type.name
  run(props.editor, 'details', { type: nodeType })
}
</script>

<style lang="scss">
.o-details-btn {
}
</style>
