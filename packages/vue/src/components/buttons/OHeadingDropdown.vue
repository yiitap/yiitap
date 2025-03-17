<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    content-class="dropdown"
    trigger="click"
    :show-arrow="false"
  >
    <template #trigger>
      <o-command-btn
        icon="format_header_pound"
        content-class="o-heading-dropdown dropdown"
        :tooltip="tr('editor.heading')"
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
    {
      label: tr('editor.paragraph'),
      value: 'paragraph',
      valueAlt: '',
      icon: 'title',
    },
    {
      label: tr('editor.heading1'),
      value: 'heading',
      valueAlt: 1,
      icon: 'format_h1',
      separator: true,
    },
    {
      label: tr('editor.heading2'),
      value: 'heading',
      valueAlt: 2,
      icon: 'format_h2',
    },
    {
      label: tr('editor.heading3'),
      value: 'heading',
      valueAlt: 3,
      icon: 'format_h3',
    },
    {
      label: tr('editor.heading4'),
      value: 'heading',
      valueAlt: 4,
      icon: 'format_h4',
    },
    {
      label: tr('editor.heading5'),
      value: 'heading',
      valueAlt: 5,
      icon: 'format_h5',
    },
  ]
})

function isActive(item: Indexable) {
  return item.value === 'heading'
    ? props.editor?.isActive(item.value, { level: item.valueAlt })
    : props.editor?.isActive(item.value)
}

function onSelect(item: Indexable) {
  popover.value?.setShow(false)
  run(props.editor as Editor, item.value, {
    level: item.valueAlt,
  })
}
</script>

<style lang="scss">
.o-heading-dropdown {
}
</style>
