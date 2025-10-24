<template>
  <section v-if="editor && !isInlinePlaceholderActive">
    <floating-menu :editor="editor" :options="options">
      <section class="tiptap-toolbar" :class="menuClass">
        <template v-if="showBack">
          <o-menubar-btn icon="arrow_back" @click="onBackToMain" />
        </template>

        <template v-for="(item, index) of dynamicMenu" :key="index">
          <o-divider vertical v-if="item === 'separator'" />
          <component
            :name="item"
            :is="getComponent(item)"
            :editor="editor"
            v-else-if="typeof item === 'string'"
          />
          <component :is="item" :editor="editor" v-else />
        </template>
      </section>
    </floating-menu>
  </section>
</template>

<script setup lang="ts">
/**
 * @see https://tiptap.dev/docs/editor/extensions/functionality/floatingmenu
 */
import { ref, computed } from 'vue'
import { getMarkRange } from '@tiptap/core'
import { Editor } from '@tiptap/vue-3'
import { FloatingMenu } from '@tiptap/vue-3/menus'
import {
  InlinePlaceholderKey,
  type InlinePlaceholderMeta,
} from '@yiitap/extension-placeholder'
import { getComponent } from '../menu'
import { DefaultFloating } from '../../constants/menu'
import { ODivider, OMenubarBtn } from '../index'

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

const backToMain = ref(false)

// @ts-ignore
const options = ref({
  placement: 'right' as 'left' | 'right',
  offset: 168,
}) // mobile

function onBackToMain() {
  backToMain.value = true
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
  return !backToMain.value && isLinkSelected.value
})

const dynamicMenu = computed(() => {
  let menu = props.menu
  return menu.length > 0 ? menu : DefaultFloating
})

const isInlinePlaceholderActive = computed(() => {
  const pluginState = InlinePlaceholderKey.getState(props.editor.state) as {
    active: InlinePlaceholderMeta | null
  }
  return !!pluginState?.active
})
</script>

<style lang="scss">
.o-floating-menu {
}
</style>
