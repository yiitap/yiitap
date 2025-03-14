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
        icon="title"
        content-class="o-text-format-dropdown dropdown"
        :tooltip="tr('editor.textFormat')"
      >
        <o-icon name="arrow_drop_down" class="arrow" />
      </o-command-btn>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-list-item
          :class="{ 'is-active': editor?.isActive(item.value) }"
          @click="onSelect(item.value)"
        >
          {{ item.label }}
          <template #prefix>
            <o-icon :name="item.icon" />
          </template>
          <template #suffix>
            <o-icon name="done" small v-if="editor?.isActive(item.value)" />
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
    type: Editor,
  },
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()

const options = computed(() => {
  return [
    {
      label: tr('editor.strikethrough'),
      value: 'strike',
      icon: 'format_strikethrough',
    },
    {
      label: tr('editor.underline'),
      value: 'underline',
      icon: 'format_underlined',
    },
    { label: tr('editor.code'), value: 'code', icon: 'code' },
  ]
})

function onSelect(value: string) {
  popover.value?.setShow(false)
  run(props.editor as Editor, value)
}
</script>

<style lang="scss">
.o-text-format-dropdown {
}
</style>
