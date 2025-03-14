<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    tippy-class="dropdown"
    trigger="click"
  >
    <template #trigger>
      <o-command-btn
        icon="format_paint"
        content-class="o-style-dropdown o-command-btn dropdown"
        :tooltip="tr('label.styles')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-divider v-if="item.separator" />
        <o-list-item
          :class="{ 'is-active': isActive(item) }"
          @click="onSelect(item)"
        >
          {{ item.label }}
          <template #prefix>
            <o-icon :name="item.icon" />
          </template>
          <template #suffix>
            <o-icon name="done" small v-if="isActive(item)" />
          </template>
        </o-list-item>
      </template>
    </o-list>
  </o-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Editor } from '@tiptap/core'
import {
  OCommandBtn,
  ODivider,
  OIcon,
  OList,
  OListItem,
  OPopover,
} from '../index'

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

const options = computed(() => {
  return [
    { label: tr('editor.paragraph'), value: 'paragraph', icon: 'title' },
    {
      label: tr('editor.heading1'),
      value: 'heading',
      icon: 'format_h1',
      options: { level: 1 },
    },
    {
      label: tr('editor.heading2'),
      value: 'heading',
      icon: 'format_h2',
      options: { level: 2 },
    },
    {
      label: tr('editor.heading3'),
      value: 'heading',
      icon: 'format_h3',
      options: { level: 3 },
    },
    { label: tr('editor.todoList'), value: 'taskList', icon: 'check_box' },
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
    {
      label: tr('editor.blockquote'),
      value: 'blockquote',
      icon: 'format_quote_open',
    },
    {
      label: tr('editor.removeFormat'),
      value: 'clearFormat',
      icon: 'format_clear',
      separator: true,
    },
  ]
})

function isActive(item) {
  return props.editor?.isActive(item.value, item.options)
}

function onSelect(item: Indexable) {
  popover.value.setShow(false)
  run(props.editor as Editor, item.value, item.options)
}
</script>

<style lang="scss">
.o-style-dropdown {
}
</style>
