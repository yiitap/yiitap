<template>
  <div class="o-list-group">
    <o-menubar-btn
      v-for="(item, index) in options"
      :key="index"
      :icon="item.icon"
      :tooltip="item.label"
      :content-class="{ 'is-active': editor?.isActive(item.value) }"
      @click="onClick(item)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OMenubarBtn from '../common/OMenubarBtn.vue'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'
import { Editor } from '@tiptap/core'

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
})

const { tr } = useI18n()
const { run } = useTiptap()

const options = computed(() => {
  return [
    {
      label: tr('editor.unorderedList'),
      value: 'bulletList',
      icon: 'format_list_bulleted',
    },
    {
      label: tr('editor.orderedList'),
      value: 'orderedList',
      icon: 'format_list_numbered',
    },
    { label: tr('editor.todoList'), value: 'taskList', icon: 'check_box' },
  ]
})

function onClick(item: Indexable) {
  run(props.editor, item.value)
}
</script>

<style lang="scss">
.o-list-group {
  display: flex;
}
</style>
