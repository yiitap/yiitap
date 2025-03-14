<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    tippy-class="dropdown"
    size="medium"
    trigger="click"
    :show-arrow="false"
  >
    <template #trigger>
      <o-tooltip trigger="hover">
        <template #trigger>
          <div class="o-list-dropdown o-button-group">
            <o-btn
              :icon="current?.icon"
              class="o-command-btn"
              @click.stop="onSelectCurrent"
            />
            <o-btn icon="arrow_drop_down" class="o-command-btn" />
          </div>
        </template>
        {{ current?.label }}
      </o-tooltip>
    </template>

    <o-list hoverable clickable>
      <template v-for="(item, index) in options" :key="index">
        <o-list-item
          :class="{ 'is-active': editor?.isActive(item.value) }"
          @click="onSelect(item)"
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
import { ref, computed, onMounted } from 'vue'
import { Editor } from '@tiptap/core'
import { OBtn, OIcon, OPopover, OList, OListItem, OTooltip } from '../index'

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
const current = ref()

function onSelectCurrent() {
  run(props.editor as Editor, current.value.value)
}

function onSelect(item: Indexable) {
  popover.value.setShow(false)
  current.value = item
  run(props.editor as Editor, item.value)
}

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

onMounted(() => {
  current.value = options.value[0]
})
</script>

<style lang="scss">
.o-list-dropdown {
  .o-command-btn {
    width: 26px;
  }
}
</style>
