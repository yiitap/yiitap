<template>
  <o-popover
    ref="popover"
    placement="left"
    content-class="dropdown"
    trigger="click"
    :offset="[0, 2]"
    @update:show="onShow"
  >
    <template #trigger>
      <div
        class="o-drag-btn"
        :class="{ selected: selected }"
        contenteditable="false"
        draggable="true"
        data-drag-handle
        @dragstart="onDragStart"
        @dragend="onDragEnd"
      >
        <o-btn type="tertiary" class="o-node-btn">
          <o-icon :name="block.icon" :color="block.color" small />
          <o-icon name="drag_indicator" small />
        </o-btn>
      </div>
    </template>

    <drag-node-view v-bind="props" @action="onAction" />
  </o-popover>
</template>

<script setup lang="ts">
import { computed, type PropType, ref, watch } from 'vue'
import useTiptap from '../../../hooks/useTiptap'
import { Blocks } from '../../../constants/block'
import { Color } from '../../../constants/color'
import DragNodeView from './DragNodeView.vue'
import { OBtn, OIcon, OPopover } from '../../index'
import type { NodeViewProps } from '@tiptap/core'

const props = defineProps({
  editor: {
    type: Object as PropType<NodeViewProps['editor']>,
    required: true as const,
  },
  node: {
    type: Object as PropType<NodeViewProps['node']>,
    required: true as const,
  },
  getPos: {
    type: Function as PropType<NodeViewProps['getPos']>,
    required: true as const,
  },
  updateAttributes: {
    type: Function as PropType<NodeViewProps['updateAttributes']>,
    required: true as const,
  },
  deleteNode: {
    type: Function as PropType<NodeViewProps['deleteNode']>,
    required: true as const,
  },
})
const emit = defineEmits(['action', 'dragstart', 'dragend'])
const { run } = useTiptap()
const popover = ref(null)
const selected = ref(false)
const unliftBlocks = ref(['heading', 'codeBlock', 'paragraph'])

const nodeType = computed(() => {
  const content = props.node?.content?.content
  if (content?.length > 0) {
    const first = content[0]
    if (first.type.name === 'image') {
      return first.type.name
    }
  }
  return props.node?.type.name
})

const block = computed(() => {
  let type = nodeType.value
  if (type === 'heading') {
    return {
      icon: `format_h${props.node.attrs?.level || 1}`,
      color: Color.blue,
    }
  } else if (type === 'table-wrapper') {
    type = 'table'
  }
  return Blocks.find((e) => e.value === type) || { icon: 'title' }
})

function onDragStart(event: DragEvent) {
  emit('dragstart', event)
}

function onDragEnd(event: DragEvent) {
  emit('dragend', event)
}

function onAction(item) {
  popover.value?.setShow(false)
  emit('action', item)
}

function onShow(value: boolean) {
  selected.value = value

  if (value) {
    selectNode()
  } else {
    // props.editor?.commands.focus()
  }
}

function selectNode() {
  let pos = props.getPos()
  if (!unliftBlocks.value.includes(nodeType.value)) {
    // pos += 1
  }
  props.editor?.commands.setNodeSelection(pos)
}

watch(
  () => props.getPos(),
  (newValue) => {
    popover.value?.setShow(false)
  }
)
</script>

<style lang="scss">
.o-drag-btn {
  display: flex;
  width: 40px;
  margin-left: 2px;
  cursor: grab !important;

  .o-node-btn {
    width: unset !important;
    padding: 5px 4px !important;
    cursor: grab !important;
  }
}
</style>
