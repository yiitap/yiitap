<template>
  <section class="o-drag-node-view">
    <section class="view-main" v-if="view === 'main'">
      <section v-if="isStyleType">
        <div class="group o-tips">Turn into</div>
        <section class="panel">
          <o-menubar-btn
            v-for="(item, index) in StyleBlocks"
            :key="index"
            :icon="item.icon"
            :tooltip="tr(item.label)"
            :content-class="{ 'is-active': isActive(item) }"
            quaternary
            @click="onClick(item)"
          />
        </section>
      </section>
      <o-block-menu v-bind="props" colorful show-group @action="onClick" />
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import useI18n from '../../../hooks/useI18n'
import useTiptap from '../../../hooks/useTiptap'
import { OBlockMenu, OMenubarBtn } from '../../../components/index'
import { StyleBlocks } from '../../../constants/block'
import { Color } from '../../../constants/color'

const props = defineProps(nodeViewProps)
const emit = defineEmits(['action'])

const { locale, tr } = useI18n()
const { run, onCommand } = useTiptap()
const view = ref('main')
const unliftBlocks = ref(['heading', 'codeBlock', 'paragraph'])

const nodeType = computed(() => {
  const content = props.node?.content.content
  if (content.length > 0) {
    const first = content[0]
    if (first.type.name === 'image') {
      return first.type.name
    }
  }
  return props.node?.type.name
})

const isStyleType = computed(() => {
  return StyleBlocks.find((e) => e.value === nodeType.value)
})

function isActive(item: Indexable) {
  return (
    item.value === nodeType.value &&
    props.editor?.isActive(nodeType.value, item.options)
  )
}

function onClick(item) {
  switch (item.value) {
    default:
      runCommand(item)
      break
  }
  emit('action', item)
}

function runCommand(item) {
  const pos = props.getPos()
  if (
    item.value === nodeType.value &&
    unliftBlocks.value.indexOf(nodeType.value) < 0
  ) {
    const isActive = props.editor?.isActive(nodeType.value)
    const res = props.editor?.commands.lift(nodeType.value)
    console.log('lift', nodeType.value, isActive, res)
    return
  }

  const commands = props.editor?.commands
  const focus = props.editor?.chain().focus(pos + 1)
  console.log('runCommand', item)
  onCommand(commands, focus, item.value, item.options)
  // props.editor?.commands.focus(pos)
  props.editor?.commands.setNodeSelection(pos)
}

const items = computed(() => {
  return [
    {
      label: 'editor.duplicate',
      value: 'duplicate',
      icon: 'content_copy',
      color: Color.blue,
      tips: 'Ctrl+D',
      group: 'label.common',
    },
    {
      label: 'editor.delete',
      value: 'delete',
      icon: 'delete',
      tips: 'Ctrl+D',
      color: Color.deepOrange,
    },
  ]
})
</script>

<style lang="scss">
.o-drag-node-view {
  border-radius: 4px;
  width: 240px;
  font-size: 0.9rem;

  .panel {
    .n-button {
      width: 40px;
      height: 40px;
      padding: 0;
    }
  }

  .group {
    font-size: 12px;
    padding: 4px 10px;
  }

  .item {
    min-height: 40px !important;
    text-align: left;
    background: transparent;
    border-radius: 3px;
    padding: 4px 8px;
    text-transform: unset;

    &.is-selected {
      border-color: #000;
    }

    .suffix {
      font-size: 10px;
    }
  }

  .view-emoji {
    header {
      padding: 4px 12px;
      height: unset;
    }
  }
}
</style>
