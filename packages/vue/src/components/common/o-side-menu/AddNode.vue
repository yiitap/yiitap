<template>
  <o-popover
    ref="popover"
    placement="left"
    content-class="dropdown"
    trigger="manual"
    :offset="[0, 4]"
    @update:show="onShow"
  >
    <template #trigger>
      <div class="o-add-btn" :class="{ 'is-selected': selected }">
        <o-btn type="tertiary" class="o-node-btn" @click="onAdd">
          <o-icon name="add" small />
        </o-btn>
      </div>
    </template>

    <add-node-view v-bind="props" @action="onAction" />
  </o-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import AddNodeView from './AddNodeView.vue'
import { OBtn, OIcon, OPopover } from '../../index'

const props = defineProps({
  ...nodeViewProps,
  add: {
    type: String,
    default: 'menu',
  },
})
const popover = ref<InstanceType<typeof OPopover>>()
const selected = ref(false)

const isEmpty = computed(() => {
  return props.node?.content.size === 0
})

const newPos = computed(() => {
  return isEmpty.value ? props.getPos() : props.getPos() + props.node.nodeSize
})

function onShow(value: boolean) {
  selected.value = value

  if (!value) {
    // props.editor?.commands.focus()
  }
}

function onAdd() {
  if (props.add === 'menu') {
    popover.value?.setShow(true)
  } else {
    addEmpty()
  }
}

function addEmpty() {
  const content = {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: '/',
      },
    ],
  }
  const chain = props.editor.chain()
  setTimeout(() => {
    if (isEmpty.value) {
      chain.insertContent(content).focus().run()
    } else {
      chain.insertContentAt(newPos.value, content).focus().run()
    }
  }, 1)
}

function onAction() {
  popover.value?.setShow(false)
  selected.value = false
}
</script>

<style lang="scss">
.o-add-btn {
  display: flex;

  .o-btn {
    width: 26px;
    padding: 0;
  }
}
</style>
