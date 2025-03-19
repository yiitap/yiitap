<template>
  <section class="o-ai-menu" v-if="editor">
    <o-block-popover
      v-model="showPopover"
      placement="bottom-start"
      tippy-class="ai-menu-popover"
      content-class=""
    >
      <template #popover-content>
        <section class="o-scroll">
          <section class="view-main" v-if="view === 'main'">
            <o-block-list :items="items" @select="onClick" />
          </section>
          <section class="view-output" v-if="view === 'output'">
            <div class="action-container">
              <div>
                <o-icon name="auto_awesome" class="o-tips" />
              </div>
              <div class="actions">
                <o-common-btn
                  icon="arrow_back"
                  icon-class="rotate-90"
                  tooltip="Confirm"
                  @click="onConfirm"
                />
                <o-common-btn icon="close" tooltip="Cancel" @click="onCancel" />
              </div>
            </div>
            <div class="output">
              {{ output }}
            </div>
          </section>
        </section>
      </template>

      <section class="ai-io-panel">
        <o-input
          ref="inputRef"
          class="caption-input"
          v-model="input"
          type="text"
          placeholder="Input caption"
          autofocus
          @focus="onInputBlur"
        >
          <template #prefix>
            <o-icon name="auto_awesome" class="o-tips" />
          </template>
          <template #suffix>
            <div class="o-flex o-item-center actions">
              <o-common-btn icon="keyboard_return" tooltip="Submit" />
            </div>
          </template>
        </o-input>
      </section>
    </o-block-popover>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Editor } from '@tiptap/core'
import useI18n from '../../hooks/useI18n'
import { AskAiBlocks } from '../../constants/block'

import {
  OBlockPopover,
  OBlockList,
  OCommonBtn,
  OIcon,
  OInput,
} from '../../components/index'

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
const { tr } = useI18n()
const inputRef = ref<InstanceType<typeof OInput>>()
const showPopover = ref(false)
const input = ref('')
const output = ref('')
const view = ref('main')

const items = computed(() => {
  return AskAiBlocks
})

function onInputBlur() {
  setTimeout(() => {
    showPopover.value = true
  }, 0)
}

function onClick(item: Indexable, child?: Indexable) {
  console.log('click', item, child)
  if (child) {
    showPopover.value = true
  }
  switch (item.value) {
    default:
      break
  }
  view.value = 'output'
  input.value = tr(item.label)
  output.value =
    'A gentleman should constantly strike to become stronger just like the evolution of the universe.\n' +
    'A gentleman should constantly strike to become stronger just like the evolution of the universe.\n' +
    'A gentleman should constantly strike to become stronger just like the evolution of the universe.\n' +
    'A gentleman should constantly strike to become stronger just like the evolution of the universe.\n' +
    'A gentleman should generously cultivate to become tolerant just like the earth bears everything on it.\n'
  return true
}

function onCancel() {
  reset()
  inputRef.value?.focus()
}

function onConfirm() {
  props.editor
    .chain()
    .focus()
    .deleteSelection()
    .insertContent(output.value)
    .setTextSelection({
      from: props.editor.state.selection.from,
      to: props.editor.state.selection.from + output.value.length,
    })
    .run()
  reset()
  showPopover.value = false
  setTimeout(() => {
    emit('confirm')
  }, 0)
}

function reset() {
  view.value = 'main'
  output.value = ''
  input.value = ''
}

onMounted(() => {
  setTimeout(() => {
    inputRef.value?.focus()
    showPopover.value = true
  }, 300)
})
</script>

<style lang="scss">
.o-ai-menu {
  .ai-io-panel {
    width: 445px;
    .o-input {
      outline: none;

      &:has(input:focus) {
        background: transparent;
      }
    }
  }
}

.ai-menu-popover {
  .tippy-content {
    min-width: 240px !important;
    max-width: 640px !important;

    .popover-content {
      padding: 2px !important;
    }

    .o-scroll {
      padding: 6px;
      max-height: 400px !important;
    }

    .view-output {
      padding: 2px;
      text-align: justify;
      .action-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 4px;
      }

      .actions {
        display: flex;
        align-items: center;
        .o-btn {
          height: 30px;
          padding: 8px 12px;
          margin-left: 4px;
          background: var(--yii-active-bg-color);
        }
      }
    }
  }
}
</style>
