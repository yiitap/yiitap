<template>
  <section class="o-inline-math-menu tiptap-toolbar" v-if="editor">
    <o-input
      ref="input"
      v-model="latex"
      type="text"
      autofocus
      clearable
      @keydown.enter.prevent="onConfirm"
    >
      <template #prefix>
        <o-icon name="function" class="o-tips" />
      </template>
      <template #suffix>
        <o-icon
          name="keyboard_return"
          class="clear o-tips"
          @click="onConfirm"
          v-if="latex"
        />
      </template>
    </o-input>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Editor } from '@tiptap/core'
import {
  InlinePlaceholderKey,
  type InlinePlaceholderMeta,
} from '@yiitap/extension-placeholder'
import { useTiptap } from '../../hooks'

import { OIcon, OInput } from '../../components/index'
import { NodeSelection } from '@tiptap/pm/state'

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
  menuClass: {
    type: String,
    default: ``,
  },
})
const emit = defineEmits(['confirm'])

const { run } = useTiptap()
const input = ref(null)
const latex = ref('')
const pos = ref(null)

const isInlinePlaceholderActive = computed(() => {
  const pluginState = InlinePlaceholderKey.getState(props.editor.state) as {
    active: InlinePlaceholderMeta | null
  }
  return !!pluginState?.active
})

function onLoad() {
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
  setTimeout(() => {
    input.value?.focus()
  }, 300)
}

function onConfirm() {
  console.log('latex', latex.value, pos.value)

  if (pos.value) {
    if (latex.value) {
      run(props.editor as Editor, 'inlineMathUpdate', {
        latex: latex.value,
      })
    } else {
      run(props.editor as Editor, 'inlineMathDelete', {
        pos: pos.value,
      })
    }
  } else {
    if (latex.value) {
      run(props.editor as Editor, 'inlineMathInsert', {
        latex: latex.value,
      })
    }
  }

  setTimeout(() => {
    emit('confirm')
  }, 0)
}

const onFocus = () => {
  props.editor.view.dispatch(
    props.editor.state.tr.setMeta(InlinePlaceholderKey, { type: 'hide' })
  )
}

onMounted(() => {
  onLoad()
  props.editor.on('focus', onFocus)
})

onUnmounted(() => {
  props.editor.off('focus', onFocus)
})
</script>

<style lang="scss">
.o-inline-math-menu {
  .o-input {
    outline: none !important;
    &:has(input:focus) {
      background: transparent !important;
    }
  }
}
</style>
