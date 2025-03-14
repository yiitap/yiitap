<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    tippy-class="dropdown"
    trigger="click"
    :show-arrow="false"
  >
    <template #trigger>
      <o-command-btn
        icon="format_font"
        content-class="o-font-family-dropdown dropdown"
        :tooltip="tr('editor.fontFamily')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-divider v-if="item.separator" />
        <o-list-item
          :class="{
            'is-active': editor?.isActive('textStyle', {
              fontFamily: item.value,
            }),
          }"
          @click="onSelect(item.value)"
        >
          <span :style="`font-family: ${item.value}`">
            {{ item.label }}
          </span>
          <template #suffix>
            <o-icon
              name="done"
              small
              v-if="editor?.isActive('textStyle', { fontFamily: item.value })"
            />
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
    { label: tr('editor.default'), value: 'system-ui' }, // todo
    { label: 'Arial', value: 'Arial', separator: true },
    { label: 'Arial Black', value: 'Arial Black' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Impact', value: 'Impact' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Tahoma', value: 'Tahoma' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Courier New', value: 'Courier New', separator: true },
    { label: 'Monaco', value: 'Monaco' },
    { label: 'Monospace', value: 'monospace' },
  ]
})

function onSelect(value: string) {
  popover.value?.setShow(false)
  run(props.editor as Editor, 'fontFamily', {
    fontFamily: value,
  })
}
</script>

<style lang="scss">
.o-font-family-dropdown {
}
</style>
