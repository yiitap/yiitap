<template>
  <section v-if="editor">
    <bubble-menu
      class="o-bubble-menu"
      :class="menuClass"
      :editor="editor"
      :should-show="shouldShow"
      :tippy-options="options"
    >
      <o-ai-menu :editor="editor" @confirm="onAiConfirm" v-if="showAi" />
      <section class="container" v-else>
        <template v-if="showBack">
          <o-menubar-btn
            icon="arrow_back"
            :tooltip="tr('link.back')"
            @click="onBackToMain"
          />
          <o-divider vertical />
        </template>

        <template v-for="(item, index) of dynamicMenu" :key="index">
          <o-divider vertical v-if="item === 'separator'" />
          <component
            :name="item"
            :is="getComponent(item)"
            :editor="editor"
            @click="onClick(item)"
            v-else-if="typeof item === 'string'"
          />
          <component :is="item" :editor="editor" v-else />
        </template>
      </section>
    </bubble-menu>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Editor, getMarkRange, isTextSelection } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/vue-3'
import { getComponent } from '../menu'
import useI18n from '../../hooks/useI18n'
import { useTheme } from '../../hooks'
import {
  DefaultBubble,
  ImageBubble,
  ImageLinkBubble,
  LinkBubble,
  TableBubble,
} from '../../constants/menu'
import { ODivider, OMenubarBtn, OAiMenu } from '../index'

const props = defineProps({
  editor: {
    type: Editor,
  },
  menu: {
    type: Array,
    default: function () {
      return []
    },
  },
  tableToolbar: {
    type: Array,
    default: function () {
      return []
    },
  },
  menuClass: {
    type: String,
    default: ``,
  },
})
const { tr } = useI18n()
const { theme } = useTheme()
const backToMain = ref(false)
const showAi = ref(false)
const aiConfirmed = ref(false)
const options = ref({
  duration: 100,
  placement: 'bottom' as 'bottom' | 'top',
  role: 'popover',
  trigger: 'manual',
  arrow: false,
  onShow: () => {
    backToMain.value = false
    showAi.value = false
    aiConfirmed.value = false
  },
  onHide: () => {
    aiConfirmed.value = false
  },
})

function onBackToMain() {
  backToMain.value = true
}

function onClick(item: string) {
  if (item === 'ai') {
    showAi.value = true
  }
}

function onAiConfirm() {
  aiConfirmed.value = true
}

function isLinkSelection(selection) {
  const { schema } = props.editor
  const linkType = schema.marks.link
  if (!linkType) return false
  if (!selection) return false

  const { $from, $to } = selection
  const range = getMarkRange($from, linkType)
  if (!range) return false
  return true
}

function shouldShow({ editor, element, view, state, oldState, from, to }) {
  const { doc, selection } = state
  const { empty } = selection
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(state.selection)

  // if (showAi.value) return true
  if (!view.hasFocus() || empty || aiConfirmed.value) {
    return false
  }
  if (isEmptyTextBlock) {
    if (editor.isActive('link') && !editor.isActive('image')) {
      return false
    }
  }

  const includeNodes = ['image']
  const excludeNodes = ['toc', 'video', 'model-viewer']
  const node = selection.node
  const nodeType = node?.type?.name
  // console.log('node', node, nodeType, editor.isActive('table'));
  if (editor.isActive('codeBlock') || excludeNodes.indexOf(nodeType) >= 0) {
    return false
  }
  if (nodeType && !includeNodes.includes(nodeType)) {
    return false
  }

  return true
}

const isLinkSelected = computed(() => {
  if (props.editor) {
    const { state } = props.editor
    const { tr } = state
    const { selection } = tr

    return isLinkSelection(selection)
  } else {
    return false
  }
})

const showBack = computed(() => {
  return (
    !backToMain.value &&
    isLinkSelected.value &&
    !props.editor?.isActive('image')
  )
})

const dynamicMenu = computed(() => {
  let menu = props.menu
  if (!backToMain.value) {
    if (props.editor?.isActive('image')) {
      menu = isLinkSelected.value ? ImageLinkBubble : ImageBubble
    } else if (props.editor?.isActive('table')) {
      menu = TableBubble
    } else if (isLinkSelected.value) {
      menu = LinkBubble
    }
  }
  return menu.length > 0 ? menu : DefaultBubble
})

onMounted(() => {
  backToMain.value = false
})
</script>

<style lang="scss">
.bubble-menu {
  .o-simple-command-btn:not(:first-child) {
    margin-left: 2px;
  }
}
</style>
