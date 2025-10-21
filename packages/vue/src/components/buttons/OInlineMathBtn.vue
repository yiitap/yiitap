<template>
  <o-popover
    ref="popover"
    class="o-simple-command-btn"
    placement="bottom"
    trigger="click"
    arrow
    v-model:show="showPopover"
    @update:show="onShow"
  >
    <template #trigger>
      <o-command-btn
        icon="function"
        :content-class="{ 'is-active': editor?.isActive('inlineMath') }"
        :tooltip="tr('editor.inlineMath')"
      >
      </o-command-btn>
    </template>

    <o-meta-input
      :title="pos ? tr('label.edit') : tr('editor.add')"
      :val="latex"
      icon="function"
      @cancel="onCancel"
      @confirm="onConfirm"
      v-if="showPopover"
    >
      <template #header-right>
        <o-command-btn icon="help" :tooltip="tr('label.help')" @click="onHelp">
        </o-command-btn>
      </template>
    </o-meta-input>
  </o-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Editor } from '@tiptap/core'
import { OCommandBtn, OMetaInput, OPopover } from '../index'

import useI18n from '../../hooks/useI18n'
import useTiptap from '../../hooks/useTiptap'
import { NodeSelection } from '@tiptap/pm/state'

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
})
const { tr } = useI18n()
const { run } = useTiptap()
const popover = ref<InstanceType<typeof OPopover>>()
const showPopover = ref(false)
const latex = ref('')
const pos = ref(null)

function onShow() {
  latex.value = ''
  pos.value = null
  if (props.editor.isActive('inlineMath')) {
    const { state } = props.editor
    const { selection, schema } = state

    if (selection instanceof NodeSelection) {
      const node = selection.node
      pos.value = selection.from

      if (node.type.name === 'inlineMath') {
        latex.value = node.attrs.latex
      }
    }
  }
}

function onCancel() {
  popover.value?.setShow(false)
}

function onConfirm(value: string) {
  console.log('confirm', value)
  if (pos.value) {
    if (value) {
      run(props.editor as Editor, 'inlineMathUpdate', {
        latex: value,
        pos: pos.value,
      })
    } else {
      run(props.editor as Editor, 'inlineMathDelete', {
        pos: pos.value,
      })
    }
  } else {
    if (value) {
      run(props.editor as Editor, 'inlineMathInsert', {
        latex: value,
        pos: pos.value,
      })
    }
  }
  popover.value?.setShow(false)
}

function onHelp() {
  window.open('https://katex.org/docs/supported.html', 'target')
}
</script>

<style lang="scss">
.o-inline-math-btn {
}
</style>
