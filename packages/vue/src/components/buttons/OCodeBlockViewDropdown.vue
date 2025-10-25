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
        content-class="o-code-block-view-dropdown dropdown"
        :icon="currentItem.icon"
        :tooltip="tr('label.view')"
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
            <o-icon :name="item.suffixIcon" small v-if="item.suffixIcon" />
            <o-icon name="done" small v-else-if="isActive(item)" />
          </template>
        </o-list-item>
      </template>
    </o-list>
  </o-popover>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'
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
  modelValue: {
    type: String,
    default: 'splitVertical',
  },
})
const emits = defineEmits(['update:modelValue'])
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref(null)

const options = computed(() => {
  return [
    {
      label: tr('editor.code'),
      value: 'code',
      icon: 'code',
    },
    {
      label: tr('label.preview'),
      value: 'preview',
      icon: 'mermaid',
    },
    {
      label: tr('label.splitHorizontal'),
      value: 'splitHorizontal',
      icon: 'splitscreen_right',
    },
    {
      label: tr('label.splitVertical'),
      value: 'splitVertical',
      icon: 'splitscreen_bottom',
    },
    {
      label: tr('label.help'),
      value: 'help',
      icon: 'help',
      suffixIcon: 'open_in_new',
      separator: true,
    },
  ]
})

const currentItem = computed(() => {
  return options.value.find((e) => e.value === props.modelValue)
})

function isActive(item: Indexable) {
  return props.modelValue === item.value
}

function onSelect(item: Indexable) {
  popover.value?.setShow(false)

  switch (item.value) {
    case 'help':
      window.open('https://mermaid.js.org/intro/', 'target')
      break
    default:
      emits('update:modelValue', item.value)
  }
}
</script>

<style lang="scss">
.o-code-block-view-dropdown {
}
</style>
