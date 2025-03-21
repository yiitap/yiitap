<template>
  <o-node-view
    v-bind="props"
    class="o-ai-block-view"
    :class="{ 'is-empty': isEmpty, 'has-focus': isFocused }"
    @contextmenu.prevent="onContextMenu"
  >
    <!-- Empty -->
    <o-block-popover
      v-model="showPopover"
      placement="bottom-start"
      tippy-class="ai-block-popover"
      :offset="[0, 14]"
      v-if="isEmpty"
    >
      <template #popover-content>
        <section class="o-scroll">
          <section class="view-main">
            <o-block-list
              :items="items"
              @select="onSelect"
              :use-keyboard="showPopover"
            />
          </section>
        </section>
      </template>

      <!-- Visible Content -->
      <div class="block-container">
        <div class="block-content">
          <o-input
            ref="inputRef"
            v-model="promptInput"
            :placeholder="tr('ai.tellAi')"
            type="text"
            autofocus
            clearable
            @focus="onInputFocus"
          >
            <template #prefix>
              <o-icon name="auto_awesome" />
            </template>
            <template #suffix>
              <o-common-btn
                icon="arrow_back"
                icon-class="rotate-90"
                :tooltip="tr('label.generate')"
                :loading="generating"
                @click="onGenerate"
              />
            </template>
          </o-input>
        </div>
      </div>
    </o-block-popover>

    <!-- Not Empty -->
    <o-block-popover
      v-model="updatePopover"
      placement="top-end"
      tippy-class="ai-block-update-popover"
      :offset="[0, 18]"
      v-show="!isEmpty"
    >
      <template #popover-content>
        <section class="edit-prompt" v-if="updateView === 'edit'">
          <o-input
            ref="updateInputRef"
            v-model="promptInput"
            :placeholder="tr('ai.tellAi')"
            type="text"
            autofocus
            clearable
          >
            <template #prefix>
              <o-icon name="auto_awesome" />
            </template>
            <template #suffix>
              <o-common-btn
                icon="arrow_back"
                icon-class="rotate-90"
                :tooltip="tr('label.generate')"
                :loading="generating"
                @click="onGenerate"
              />
            </template>
          </o-input>
        </section>
        <section v-else>
          <o-btn-group>
            <div data-tippy-role="tooltip">
              <o-btn icon="auto_awesome" @click="onUpdate">
                <span class="label">
                  {{ tr('label.generatedBy') }}
                  {{ getProviderProp(aiProvider, 'name') || 'AI' }}
                </span>
              </o-btn>
            </div>
            <o-common-btn
              icon="autorenew"
              :tooltip="tr('label.update')"
              :loading="generating"
              @click="onGenerate"
            />
          </o-btn-group>
        </section>
      </template>

      <!-- Visible Content -->
      <div class="block-container">
        <div class="block-content">
          <node-view-content />
        </div>

        <o-context-menu
          v-model="showContextMenu"
          :event="mouseEvent"
          v-if="isEditable"
        >
          <o-block-menu v-bind="props" @action="onAction" />
        </o-context-menu>
      </div>
    </o-block-popover>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import {
  OBlockList,
  OBlockMenu,
  OBlockPopover,
  OCommonBtn,
  OContextMenu,
  OIcon,
  OInput,
  ONodeView,
  OBtn,
  OBtnGroup,
  OToast,
} from '../../components'
import { useAi, useI18n, useNodeView, useTheme, useTiptap } from '../../hooks'
import { AiBlocks, getProviderProp, Prompts } from '../../constants'
import { AiMessageChunks } from '../../constants/data'
import { toJSON } from '../../utils/convert'

const props = defineProps(nodeViewProps)
const { md, aiOption, createStreamingChatCompletion } = useAi()
const { languageName, tr } = useI18n()
const { isFocused, bind, unbind, checkFocus } = useNodeView()
const { theme } = useTheme()
const { isEditable } = useTiptap()

const { getPos } = props
const inputRef = ref(null)
const promptInput = ref('')
const showContextMenu = ref(false)
const mouseEvent = ref({})
const showPopover = ref(false)
const updatePopover = ref(false)
const updateView = ref('')
const updateInputRef = ref(null)
const generating = ref(false)
const isDebug = ref(false)

const systemMessage = computed((): ChatMessage => {
  const prompt = Prompts.writing.replace('[LANGUAGE]', languageName.value)
  return {
    role: 'system',
    content: prompt,
  }
})
const messages = ref<ChatMessage[]>([systemMessage.value])

const isEmpty = computed(() => {
  return !props.node.textContent
})

const items = computed(() => {
  return AiBlocks
})

const aiProvider = computed({
  get() {
    return props.node.attrs.provider
  },
  set(value) {
    props.updateAttributes({ provider: value })
  },
})

const prompt = computed({
  get() {
    return props.node.attrs.prompt
  },
  set(value) {
    props.updateAttributes({ prompt: value })
  },
})

const time = computed({
  get() {
    return props.node.attrs.time
  },
  set(value) {
    props.updateAttributes({ time: value })
  },
})

function init() {
  promptInput.value = prompt.value
  if (isEmpty.value && !prompt.value) {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 0)
  }
}

function onInputFocus() {
  setTimeout(() => {
    // Todo
    // showPopover.value = true
  }, 0)
}

function onUpdate() {
  updateView.value = 'edit'
  setTimeout(() => {
    updateInputRef.value?.focus()
  }, 0)
}

function onGenerate() {
  aiProvider.value = aiOption.value.provider
  prompt.value = promptInput.value
  time.value = Date.now()
  generating.value = true
  if (updateView.value) {
    updateView.value = ''
  }

  if (isDebug.value) {
    onAiGenerateMock()
  } else {
    onAiGenerate()
  }
}

async function onAiGenerate() {
  const pos = getPos()
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
        const json = toJSON(md.render(aiMessage))
        setContent(pos, json)
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
  const pos = getPos()
  let aiMessage = ''

  try {
    for (const chunk of AiMessageChunks) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      aiMessage += chunk

      const json = toJSON(md.render(aiMessage))
      setContent(pos, json)
    }
  } catch (e) {
    console.error(e)
  }
  generating.value = false
}

/**
 * Update the content of current node
 *
 * Fixed: Not work currently, use setAiBlockContent in the future
 * Tips: <node-view-content /> requires always visible, use v-show instead of v-if.
 */
function setContent(pos: number, json: Record<string, any>) {
  const nodeJson = props.node.toJSON()
  nodeJson.content = json.content

  props.editor?.commands.updateAiBlock(pos, nodeJson)
  props.editor.commands.setNodeSelection(pos)
  props.editor.view.focus()

  scrollIntoView()
}

function scrollIntoView() {
  const content = props.node.content
  const lastContent = content.lastChild
  if (lastContent && lastContent.attrs['data-id']) {
    const dataId = lastContent.attrs['data-id']
    const element = document.querySelector(`[data-id="${dataId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

function onAction(action: BlockOption) {
  showContextMenu.value = false
  switch (action.value) {
    case 'replace':
      break
  }
}

function onSelect(item: Indexable, child?: Indexable) {
  if (child) {
    promptInput.value = tr(child.label)
  } else {
    promptInput.value = tr(item.label)
  }
  showPopover.value = false
}

function onContextMenu(e: MouseEvent) {
  showContextMenu.value = true
  mouseEvent.value = e
}

watch(
  () => props.node.content,
  (newValue) => {
    checkFocus()
  }
)

watch(isEmpty, (newValue) => {
  if (newValue) {
    updatePopover.value = false
  }
})

watch(isFocused, (newValue) => {
  if (newValue && !isEmpty.value) {
    setTimeout(() => {
      promptInput.value = prompt.value
      updateView.value = ''
      updatePopover.value = newValue
    }, 100)
  }
})

onMounted(() => {
  init()
  bind(props)
})

onBeforeUnmount(() => {
  unbind()
})
</script>

<style lang="scss">
.o-ai-block-view {
  position: relative;
  border-radius: 4px;
  padding: 8px 8px;
  margin: 8px -8px;

  &.is-empty,
  &:hover {
    outline: solid 2px rgba(#9c27b0, 0.2);
  }
  &.has-focus {
    outline: solid 2px rgba(#9c27b0, 0.5);
  }

  .block-container {
    .o-popover {
      width: 100%;
    }

    .o-icon {
      color: rgba(#9c27b0, 0.5);
    }

    .o-input {
      padding: 0 8px;
      outline: none;
      &:has(input:focus) {
        background: transparent;
        outline: none;
      }
    }
  }

  .block-content {
    width: 100%;
  }
}

.ai-block-popover {
  .tippy-content {
    .popover-content {
      padding: 2px !important;
    }

    .o-scroll {
      padding: 6px;
      max-height: 400px !important;
    }
  }
}

.ai-block-update-popover {
  .popover-content {
    min-width: unset !important;
    padding: 0 !important;

    .o-btn-group {
      .o-btn {
        background: transparent;
        height: 40px;
        min-width: 40px;
      }
    }

    .o-input {
      width: 600px;
      outline: none;

      &:has(input:focus) {
        background: transparent;
      }
    }
  }
}
</style>
