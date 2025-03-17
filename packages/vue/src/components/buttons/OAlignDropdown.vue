<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    content-class="dropdown"
    size="medium"
    trigger="click"
    :show-arrow="false"
  >
    <template #trigger>
      <o-command-btn
        icon="format_align_center"
        content-class="o-align-dropdown dropdown"
        :tooltip="tr('editor.align')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-list-item
          :class="{ 'is-active': editor?.isActive({ textAlign: item.value }) }"
          @click="onSelect(item.value)"
        >
          {{ item.label }}
          <template #prefix>
            <o-icon :name="item.icon" />
          </template>
          <template #suffix>
            <o-icon
              name="done"
              small
              v-if="editor?.isActive({ textAlign: item.value })"
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
import { OCommandBtn, OIcon, OList, OListItem, OPopover } from '../index'

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
    { label: tr('editor.left'), value: 'left', icon: 'format_align_center' },
    {
      label: tr('editor.center'),
      value: 'center',
      icon: 'format_align_center',
    },
    { label: tr('editor.right'), value: 'right', icon: 'format_align_right' },
    {
      label: tr('editor.justify'),
      value: 'justify',
      icon: 'format_align_justify',
    },
  ]
})

function onSelect(value: string) {
  popover.value?.setShow(false)
  run(props.editor as Editor, 'textAlign', {
    textAlign: value,
  })
}
</script>

<style lang="scss">
.o-align-dropdown {
}
</style>
