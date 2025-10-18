<template>
  <section class="o-ai-menu tiptap-toolbar" v-if="editor">
    <o-block-popover
      v-model="showPopover"
      placement="bottom-start"
      tippy-class="ai-menu-popover"
      content-class=""
    >
      <template #popover-content>
        <div class="o-scroll" v-if="view === 'main'">
          <section class="view-main">
            <o-block-list
              :items="items"
              @select="onClick"
              :use-keyboard="showPopover"
            />
          </section>
        </div>
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
                :loading="generating"
                @click="onConfirm"
              />
              <o-common-btn
                icon="close"
                tooltip="Cancel"
                @click="onCancel"
                v-if="!generating"
              />
            </div>
          </div>
          <div class="o-scroll" v-if="output">
            <div class="tiptap output" v-html="output"></div>
          </div>
        </section>
      </template>

      <section class="ai-io-panel">
        <o-input
          ref="inputRef"
          class="caption-input"
          v-model="filterTerm"
          type="text"
          :placeholder="tr('ai.askAi')"
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
import { useAi, useI18n } from '../../hooks'
import { AskAiBlocks, Prompts } from '../../constants'
import { AiMessageChunks } from '../../constants/data'
import { toJSON } from '../../utils/convert'

import { Node as ProseMirrorNode } from '@tiptap/pm/model'

import {
  OBlockPopover,
  OBlockList,
  OCommonBtn,
  OIcon,
  OInput,
  OToast,
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

const { md, aiOption, createStreamingChatCompletion } = useAi()
const { languageName, tr } = useI18n()
const inputRef = ref<InstanceType<typeof OInput>>()
const showPopover = ref(false)
const filterTerm = ref('')
const output = ref('')
const view = ref('main')
const prompt = ref('')
const generating = ref(false)
const isDebug = ref(false)

const systemMessage = computed((): ChatMessage => {
  const prompt = Prompts.writing.replace('[LANGUAGE]', languageName.value)
  return {
    role: 'system',
    content: prompt,
  }
})
const messages = ref<ChatMessage[]>([
  {
    role: 'system',
    content: 'You are an assistant. Please answer in [LANGUAGE].',
  },
])

const items = computed(() => {
  return AskAiBlocks.filter((item) => item.value.indexOf(filterTerm.value) >= 0)
})

function getSelectedText() {
  const { from, to } = props.editor.state.selection
  return props.editor.state.doc.textBetween(from, to, '')
}

function onInputBlur() {
  setTimeout(() => {
    showPopover.value = true
  }, 0)
}

function onClick(item: Indexable, child?: Indexable) {
  if (child) {
    showPopover.value = true
  }
  prompt.value = item.options.prompt.replaceAll('[CONTENT]', getSelectedText())
  switch (item.value) {
    case 'translate':
      prompt.value = prompt.value.replace('[LANGUAGE]', child.value)
      break
    case 'change_tone':
      prompt.value = prompt.value.replace('[TONE]', child.value)
      break
    default:
      break
  }
  filterTerm.value = tr(item.label)
  onGenerate()

  return true
}

function onCancel() {
  reset()
  inputRef.value?.focus()
}

function onConfirm() {
  const json = toJSON(props.editor, output.value)
  let totalSize = 0
  for (const nodeJson of json.content) {
    const newNode = ProseMirrorNode.fromJSON(props.editor.schema, nodeJson)
    totalSize += newNode.nodeSize
  }
  props.editor
    .chain()
    .focus()
    .deleteSelection()
    .insertContent(json.content)
    .setTextSelection({
      from: props.editor.state.selection.from,
      to: props.editor.state.selection.from + totalSize + 1,
    })
    .run()
  reset()
  showPopover.value = false
  setTimeout(() => {
    emit('confirm')
  }, 0)
}

function onGenerate() {
  view.value = 'output'
  generating.value = true

  if (isDebug.value) {
    onAiGenerateMock()
  } else {
    onAiGenerate()
  }
}

async function onAiGenerate() {
  let aiMessage = ''
  messages.value.push({ role: 'user', content: prompt.value })
  if (messages.value[0].role === 'system') {
    messages.value.shift()
    messages.value.unshift(systemMessage.value)
  }

  try {
    const fullMessage = await createStreamingChatCompletion(
      messages.value,
      (chunk) => {
        aiMessage += chunk
        messages.value = [
          ...messages.value.slice(0, -1),
          { role: 'assistant', content: aiMessage },
        ]
        output.value = md.render(aiMessage)
      }
    )
    // messages.value.push({role: 'assistant', content: fullMessage})
  } catch (e) {
    // Remove last use message if failed
    messages.value.pop()
    console.error(e)
    OToast.error(tr('ai.error'))
  }
  generating.value = false
}

async function onAiGenerateMock() {
  let aiMessage = ''

  for (const chunk of AiMessageChunks) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    aiMessage += chunk
    output.value = md.render(aiMessage)
  }
  generating.value = false
}

function reset() {
  view.value = 'main'
  output.value = ''
  filterTerm.value = ''
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
    min-width: 280px !important;
    max-width: 640px !important;

    .popover-content {
      padding: 2px !important;
    }

    .o-scroll {
      padding: 6px;
      max-height: 480px !important;
    }

    .view-output {
      width: 600px;
      padding: 2px;
      text-align: justify;
      .action-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 4px;
      }

      .action-container {
        padding: 6px;
      }

      .actions {
        display: flex;
        align-items: center;
        .o-btn {
          height: 30px;
          //padding: 8px 12px;
          margin-left: 4px;
          background: var(--yii-active-bg-color);
        }
      }
    }
  }
}
</style>
