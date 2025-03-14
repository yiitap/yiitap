<template>
  <section class="o-side-menu" v-if="editor">
    <side-menu
      ref="menu"
      class="side-menu"
      :class="menuClass"
      :editor="editor"
      :tippy-options="tippyOptions"
    >
      <section class="container">
        <add-node v-bind="nodeProps" v-if="node" />
        <drag-node
          v-bind="nodeProps"
          @dragstart="onDragStart"
          @dragend="onDragEnd"
          v-if="node"
        />
      </section>
    </side-menu>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { SideMenu } from './side-menu'

import {
  SideMenuPluginKey,
  getNodeFromCoords,
} from '../../extensions/side-menu'
import { AddNode, DragNode } from '../index'
import { type DecorationWithType, Editor } from '@tiptap/core'

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

const menu = ref(null)
const node: Ref<ProseMirrorNode | null> = ref(null)
const pos = ref(0)

const tippyOptions = computed(() => {
  return {
    arrow: false,
    duration: 100,
    placement: 'left',
    // offset: [0, 0]
  }
})

const nodeProps = computed(() => {
  return {
    editor: props.editor,
    node: node.value,
    decorations: [] as DecorationWithType[],
    selected: false,
    extension: {},
    getPos: () => pos.value,
    pos: pos.value,
    updateAttributes: updateAttributes,
    deleteNode: deleteNode,
    view: undefined,
    innerDecorations: [],
    HTMLAttributes: undefined,
  }
})

function deleteNode() {
  const from = pos.value
  const to = from + node.value?.nodeSize
  props.editor?.commands.deleteRange({ from, to })
}

function updateAttributes(attributes: {}) {
  props.editor?.commands.command(({ tr }) => {
    tr.setNodeMarkup(pos.value, undefined, {
      ...node.value?.attrs,
      ...attributes,
    })

    return true
  })
}

function onEditorTransaction({ editor, transaction }) {
  let coords = { left: 0, top: 0 }
  const state = SideMenuPluginKey.getState(props.editor.view.state)
  if (state) {
    coords = state.coords
    const n = getNodeFromCoords(coords, editor)
    // console.log('tr', n)
    if (n.node && n.pos > 0) {
      node.value = n.node as ProseMirrorNode
      pos.value = n.pos
    }
  }
}

function onDragStart(event: DragEvent) {
  menu.value?.dragstart(event)
}

function onDragEnd(event: DragEvent) {
  menu.value?.dragend(event)
}

onMounted(() => {
  props.editor?.on('transaction', onEditorTransaction)
})
</script>

<style lang="scss">
.side-menu {
  .n-button:not(:first-child) {
    margin-left: 2px;
  }

  .container {
    display: flex;

    .o-node-btn {
      height: 26px;
    }

    .o-add-btn {
      .n-button {
        width: 26px;
        padding: 0;
      }
    }

    &:has(.selected) {
      .o-add-btn {
        display: none;
      }
    }
  }
}
</style>
