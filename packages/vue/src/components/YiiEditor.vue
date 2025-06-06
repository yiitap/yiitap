<template>
  <main class="yiitap yiitap-editor" :data-theme="darkModeAlt ? 'dark' : ''">
    <!-- Main Menu -->
    <o-main-menu
      v-bind="mainMenuOptions"
      class="desktop-only"
      v-if="showMainMenu"
    >
      <template #left>
        <!-- @slot Main toolbar left area -->
        <slot name="toolbar-left" />
      </template>
      <template #right>
        <!-- @slot Main toolbar right area -->
        <slot name="toolbar-right" />
      </template>
    </o-main-menu>

    <!-- Bubble/Floating Menu -->
    <o-bubble-menu
      v-bind="bubbleMenuOptions"
      v-if="editor?.isEditable && showBubbleMenu"
    />
    <o-floating-menu
      v-bind="floatingMenuOptions"
      v-if="editor?.isEditable && showFloatingMenu"
    />
    <o-side-menu
      v-bind="sideMenuOptions"
      v-if="editor?.isEditable && showSideMenu"
    />

    <!-- Editor Content -->
    <editor-content
      class="editor-content"
      :class="`${pageView}-view`"
      :editor="editor"
    />
  </main>
</template>

<script setup lang="ts">
/**
 * YiiEditor is a full-featured block-based editor for Vue.
 */
defineOptions({ name: 'YiiEditor' })

import {
  ref,
  computed,
  onBeforeMount,
  provide,
  watch,
  type PropType,
} from 'vue'
import type { FocusPosition } from '@tiptap/core'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import TextStyle from '@tiptap/extension-text-style'

import OMainMenu from './menus/OMainMenu.vue'
import OBubbleMenu from './menus/OBubbleMenu.vue'
import OFloatingMenu from './menus/OFloatingMenu.vue'
import OSideMenu from './menus/OSideMenu.vue'

import useI18n from '../hooks/useI18n'
import {
  DefaultExtensionNames,
  BuiltinExtensionNames,
  OPlaceholder,
} from '../extensions'
import DynamicClass, { TableExtensions } from '../extensions/dynamic'
import type { Editor } from '@tiptap/core'

const props = defineProps({
  /**
   * Initial content. This can be HTML or JSON.
   */
  content: {
    type: [String, Object],
    default: '',
  },
  /**
   * Set first block as title.
   */
  title: {
    type: Boolean,
    default: false,
  },
  /**
   * Determines if users can write into the editor.
   */
  editable: {
    type: Boolean,
    default: true,
  },
  /**
   * Force the cursor to jump in the editor on initialization.
   */
  autofocus: {
    type: [String, Number, Boolean] as PropType<FocusPosition>,
    default: false,
  },
  /**
   * Set the locale of the editor
   */
  locale: {
    type: String,
    default: 'en',
  },
  /**
   * By default, Yiitap is in light mode, you can set it to dark mode.
   */
  darkMode: {
    type: Boolean,
    default: false,
  },
  /**
   * Show main menu or not.
   */
  showMainMenu: {
    type: Boolean,
    default: false,
  },
  /**
   * Show bubble menu or not.
   */
  showBubbleMenu: {
    type: Boolean,
    default: false,
  },
  /**
   * Show floating menu or not.
   */
  showFloatingMenu: {
    type: Boolean,
    default: false,
  },
  /**
   * Show side menu or not.
   */
  showSideMenu: {
    type: Boolean,
    default: false,
  },
  /**
   * Show side node or not.
   */
  showSideNode: {
    type: Boolean,
    default: false,
  },
  /**
   * Configure the list of extensions you want to enable.
   *
   * By default, Yiitap enables
   * <a href="https://github.com/yiitap/yiitap/blob/main/packages/vue/src/extensions/index.ts" target="_blank">BuiltinExtensions</a>.
   */
  extensions: {
    type: Array as () => string[],
    default: () => [],
  },
  /**
   * Configure the list of menu items you want to enable in main menu.
   *
   * By default, Yiitap uses
   * <a href="https://github.com/yiitap/yiitap/blob/main/packages/vue/src/constants/menu.ts" target="_blank">DefaultMenu</a>.
   */
  mainMenu: {
    type: Array as () => string[],
    default: () => [],
  },
  /**
   * Configure the list of menu items you want to enable in table menu.
   *
   * By default, Yiitap uses
   * <a href="https://github.com/yiitap/yiitap/blob/main/packages/vue/src/constants/menu.ts" target="_blank">TableMenu</a>.
   */
  tableMenu: {
    type: Array as () => string[],
    default: () => [],
  },
  /**
   * Configure the list of menu items you want to enable in bubble menu.
   *
   * By default, Yiitap uses
   * <a href="https://github.com/yiitap/yiitap/blob/main/packages/vue/src/constants/menu.ts" target="_blank">DefaultBubble</a>.
   */
  bubbleMenu: {
    type: Array as () => string[],
    default: () => [],
  },
  /**
   * Configure the list of menu items you want to enable in floating menu.
   *
   * By default, Yiitap uses
   * <a href="https://github.com/yiitap/yiitap/blob/main/packages/vue/src/constants/menu.ts" target="_blank">DefaultFloating</a>.
   */
  floatingMenu: {
    type: Array as () => string[],
    default: () => [],
  },
  /**
   * Set the page view of the editor.
   */
  pageView: {
    type: String,
    default: 'page',
    validator: (value: string) => ['page', 'full'].includes(value),
  },
  aiOption: {
    type: Object as PropType<AiOption>,
    default: () => {},
  },
})

// const emit = defineEmits(['transaction', 'update'])
const emit = defineEmits<{
  /**
   * Emit when content transaction
   */
  (e: 'transaction', payload: { editor: Editor; transaction: Object }): void

  /**
   * Emit when content updates
   */
  (e: 'update', payload: { json: Object; html: string }): void
}>()

const { tr } = useI18n()
const darkModeAlt = ref(false)
const isEditable = ref(true)
const localeAlt = ref('en')
const sideNodeAlt = ref(false)
const aiOptionAlt = ref<AiOption>()
provide('darkMode', darkModeAlt)
provide('isEditable', isEditable)
provide('locale', localeAlt)
provide('sideNode', sideNodeAlt)
provide('aiOption', aiOptionAlt)

const customExtensions = computed(() => {
  return buildExtensions()
})

const editor = useEditor({
  editable: props.editable,
  content: props.content,
  autofocus: props.autofocus,
  extensions: customExtensions.value,
  onUpdate: () => {
    const json = editor.value?.getJSON()
    const html = editor.value?.getHTML()
    emit('update', { json, html })
  },
  onTransaction: ({ editor, transaction }) => {
    emit('transaction', { editor, transaction })
  },
})

const mainMenuOptions = computed(() => {
  return {
    editor: editor.value,
    menu: props.mainMenu,
  }
})

const bubbleMenuOptions = computed(() => {
  return {
    editor: editor.value,
    menu: props.bubbleMenu,
  }
})

const floatingMenuOptions = computed(() => {
  return {
    editor: editor.value,
    menu: props.floatingMenu,
  }
})

const sideMenuOptions = computed(() => {
  return {
    editor: editor.value,
    menu: [],
  }
})

function buildExtensions() {
  const extensions = []

  // Default block
  if (props.title) {
    extensions.push(
      Document.extend({
        content: 'heading block*',
      })
    )
  } else {
    extensions.push(Document)
  }
  extensions.push(
    OPlaceholder.configure({
      placeholder: ({ editor, node, pos }) => {
        if (node.type.name === 'heading') {
          const level = node.attrs.level
          return pos > 0 ? `H${level}` : tr('label.untitled')
        } else if (node.type.name === 'paragraph') {
          return tr('label.typeForCommands')
        } else {
          return ''
        }
      },
    })
  )
  extensions.push(TextStyle)
  extensions.push(
    StarterKit.configure({
      document: false,
      blockquote: props.extensions.includes('OBlockquote') ? false : {},
      codeBlock: false,
      heading: props.extensions.includes('OHeading')
        ? false
        : {
            levels: [1, 2, 3, 4, 5],
          },
      paragraph: props.extensions.includes('OParagraph') ? false : {},
      dropcursor: {
        width: 5,
        color: 'skyblue',
        class: 'yiitap-dropcursor',
      },
      horizontalRule: false,
    })
  )

  // User custom extension
  // console.debug('default', DefaultExtensions)
  const list = DefaultExtensionNames.concat(props.extensions)
  for (const item of list) {
    if (typeof item === 'string') {
      // builtin extension
      if (!BuiltinExtensionNames.includes(item)) {
        continue
      }

      switch (item) {
        case 'Table':
          extensions.push(...TableExtensions)
          break
        default:
          try {
            const extension = new DynamicClass(item)
            extensions.push(extension)
            // console.debug('dynamic extension', item, extension)
          } catch (e) {
            console.error(e.message)
          }
          break
      }
    } else {
      // user provide extension
      extensions.push(item)
    }
  }
  return extensions
}

watch(
  () => props.darkMode,
  (newValue) => {
    darkModeAlt.value = newValue
  }
)

watch(
  () => props.locale,
  (newValue) => {
    localeAlt.value = newValue
  }
)

watch(
  () => props.aiOption,
  (newValue) => {
    aiOptionAlt.value = newValue
  },
  { deep: true }
)

watch(
  () => props.editable,
  (newValue) => {
    editor.value?.setEditable(newValue)
    isEditable.value = newValue
  }
)

onBeforeMount(() => {
  isEditable.value = props.editable
  aiOptionAlt.value = props.aiOption
  darkModeAlt.value = props.darkMode
  localeAlt.value = props.locale
  sideNodeAlt.value = !props.showSideMenu && props.showSideNode
})

defineExpose({
  /**
   * Editor instance. More about <a href="https://tiptap.dev/docs/editor/api/editor" target="_blank">editor api</a>.
   */
  editor,
  /**
   * Whether in dark mode
   */
  darkMode: darkModeAlt,
  /**
   * Current locale
   */
  locale: localeAlt,
})
</script>

<style lang="scss">
@use '../style/variables';
@use '../style/app';
@use '../style/tippy';
@use '../style/tiptap';
@use '../style/yiitap';
@import '../../../icon/dist/yiitap-icon.css';
</style>
