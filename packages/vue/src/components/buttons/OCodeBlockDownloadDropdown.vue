<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    content-class="dropdown"
    placement="bottom-end"
    trigger="click"
    :show-arrow="false"
  >
    <template #trigger>
      <o-command-btn
        content-class="o-code-block-download-dropdown dropdown"
        icon="download"
        :tooltip="tr('label.download')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
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
import { ref, computed, defineEmits } from 'vue'
import { Editor } from '@tiptap/core'
import { OCommandBtn, OIcon, OList, OListItem, OPopover } from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'splitVertical',
  },
})
const emits = defineEmits(['download'])
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
      label: 'SVG',
      value: 'svg',
      icon: 'mermaid',
    },
  ]
})

function isActive(item: Indexable) {
  return props.modelValue === item.value
}

function onSelect(item: Indexable) {
  popover.value?.setShow(false)
  emits('download', item.value)
}
</script>

<style lang="scss">
.o-code-block-download-dropdown {
}
</style>
