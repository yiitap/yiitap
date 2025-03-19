<template>
  <o-node-view
    v-bind="props"
    class="o-ai-block-view"
    :class="{ 'is-empty': isEmpty, 'has-focus': updatePopover }"
    @contextmenu.prevent="onContextMenu"
  >
    <!-- Empty -->
    <o-block-popover
      v-model="showPopover"
      placement="bottom-start"
      tippy-class="ai-block-popover"
      v-if="isEmpty"
    >
      <template #popover-content>
        <section class="o-scroll">
          <section class="view-main">
            <o-block-list :items="items" @select="onSelect" />
          </section>
        </section>
      </template>

      <div class="block-container">
        <div class="block-content">
          <o-input
            ref="inputRef"
            v-model="promptInput"
            placeholder="Tell the AI what to write"
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
                tooltip="Generate"
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
      content-class=""
      v-else
    >
      <template #popover-content>
        <section class="edit-prompt" v-if="updateView === 'edit'">
          <o-input
            ref="updateInputRef"
            v-model="promptInput"
            placeholder="Tell the AI what to write"
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
                tooltip="Generate"
                @click="onGenerate"
              />
            </template>
          </o-input>
        </section>
        <section v-else>
          <o-btn-group>
            <div data-tippy-role="tooltip">
              <o-btn
                icon="auto_awesome"
                label="Generate by AI"
                @click="onUpdate"
              />
            </div>
            <o-common-btn
              icon="autorenew"
              tooltip="Update"
              @click="onGenerate"
            />
          </o-btn-group>
        </section>
      </template>

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
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { toJSON } from '../../utils/convert'
import {
  OBlockList,
  OBlockMenu,
  OBlockPopover,
  OCommandBtn,
  OCommonBtn,
  OContextMenu,
  OIcon,
  OInput,
  ONodeView,
  OBtn,
  OBtnGroup,
} from '../../components'
import { useI18n, useNodeView, useTheme, useTiptap } from '../../hooks'
import { AiBlocks } from '../../constants'

const props = defineProps(nodeViewProps)
const { tr } = useI18n()
const { isFocused, bind, unbind, checkFocus } = useNodeView()
const { theme } = useTheme()
const { isEditable } = useTiptap()

const inputRef = ref(null)
const promptInput = ref('')
const { getPos } = props
const showContextMenu = ref(false)
const mouseEvent = ref({})
const showPopover = ref(false)
const updatePopover = ref(false)
const updateView = ref('')
const updateInputRef = ref(null)

const aiGeneratedHtml = `
<h2>AI generated</h2>
<p>A gentleman should constantly strike to become stronger just like the evolution of the universe.</p>
`
const aiGeneratedAppendHtml = `
<h2>AI generated</h2>
<p>A gentleman should constantly strike to become stronger just like the evolution of the universe.</p>
<p>A gentleman should constantly strike to become stronger just like the evolution of the universe.</p>
`

const isEmpty = computed(() => {
  return !props.node.textContent
})

const items = computed(() => {
  return AiBlocks
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
    showPopover.value = true
  }, 0)
}

function onUpdate() {
  updateView.value = 'edit'
  setTimeout(() => {
    updateInputRef.value?.focus()
  }, 0)
}

function onGenerate() {
  prompt.value = promptInput.value
  time.value = Date.now()
  const pos = getPos()
  const json = toJSON(aiGeneratedHtml)
  setContentLocal(pos, json)
  setTimeout(() => {
    setContentLocal(pos, toJSON(aiGeneratedAppendHtml))
  }, 500)
  if (updateView.value) {
    updateView.value = ''
  }
}

function setContentLocal(pos: number, json: Record<string, any>) {
  const nodeJson = JSON.parse(JSON.stringify(props.node))
  nodeJson.content = json.content

  if (isEmpty.value) {
    // Todo: I don't know why rigth now
    props.deleteNode()
  }

  // Replace with new content
  props.editor
    .chain()
    .setNodeSelection(pos)
    .command(({ tr }) => {
      const newNode = ProseMirrorNode.fromJSON(props.editor.schema, nodeJson)
      tr.replaceSelectionWith(newNode)
      return true
    })
    .run()
  props.editor.commands.setNodeSelection(pos)
  props.editor.view.focus()
  console.log('node', JSON.parse(JSON.stringify(props.node)))
}

/**
 * Update the content of current node
 *
 * Todo: Not work currently, use setAiBlockContent in the future
 * @param pos
 * @param json
 */
function setContent(pos: number, json: Record<string, any>) {
  const nodeJson = JSON.parse(JSON.stringify(props.node))
  nodeJson.content = json.content

  if (isEmpty.value) {
    // Todo: I don't know why
    props.deleteNode()
  }
  props.editor?.commands.setAiBlockContent(pos, nodeJson)
}

function onReplace() {
  const pos = getPos()
  const nodeJson = JSON.parse(JSON.stringify(props.node))
  nodeJson.content[0].content[0].text = 'Test'
  setContent(pos, nodeJson)
}

function onAction(action: BlockOption) {
  showContextMenu.value = false
  switch (action.value) {
    case 'replace':
      onReplace()
      break
  }
}

function onSelect(item: Indexable, child?: Indexable) {
  console.log('select', item, child)
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

watch(isFocused, (newValue) => {
  if (newValue) {
    updatePopover.value = newValue
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
  padding: 0 8px;
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
      padding: 8px 8px;
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

    .o-btn {
      background: var(--yii-active-bg-color);
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
