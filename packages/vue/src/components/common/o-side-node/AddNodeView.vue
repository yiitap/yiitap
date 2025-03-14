<template>
  <section class="o-add-node-view">
    <section class="view-main" v-if="view === 'main'">
      <section>
        <div class="group o-tips">{{ tr('label.basic') }}</div>
        <section class="panel">
          <o-menubar-btn
            v-for="(item, index) in BasicBlocks"
            :key="index"
            :icon="item.icon"
            :tooltip="tr(item.label)"
            quaternary
            @click="onClick(item)"
          />
        </section>
      </section>
      <o-list hoverable clickable>
        <template v-if="CommonBlocks.length">
          <template v-for="(item, index) in CommonBlocks" :key="index">
            <template v-if="item.group">
              <o-divider v-if="index > 0" />
              <div class="group o-tips">{{ tr(item.group) }}</div>
            </template>
            <o-list-item class="item" clickable @click="onClick(item)">
              <template #prefix>
                <o-icon :name="item.icon" :color="item.color" />
              </template>

              {{ tr(item.label) }}
            </o-list-item>
          </template>
        </template>
        <div class="item" v-else>No result</div>
      </o-list>
    </section>
    <section class="view-emoji" v-else-if="view === 'emoji'">
      <!--      <o-emoji-select @set="setEmoji" />-->
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import useI18n from '../../../hooks/useI18n'
import useTiptap from '../../../hooks/useTiptap'
import {
  ODivider,
  OIcon,
  OList,
  OListItem,
  OMenubarBtn,
} from '../../../components/index'
import { BasicBlocks, CommonBlocks } from '../../../constants/block'
import {
  EmptyParagraph,
  EmptyListItem,
  EmptyTaskItem,
} from '../../../constants/empty-block'

const props = defineProps(nodeViewProps)
const emit = defineEmits(['action'])
const { locale, tr } = useI18n()
const { run } = useTiptap()
const view = ref('main')
const currentPos = ref(0)

function onClick(item) {
  const chain = props.editor.chain()
  let content = null
  switch (item.value) {
    case 'blockquote':
      content = {
        content: EmptyParagraph,
      }
      break
    case 'callout':
      content = {
        content: EmptyParagraph,
        attrs: { icon: '💡' },
      }
      break
    case 'codeBlock':
      content = {
        content: [],
        attrs: { language: 'shell' },
      }
      break
    case 'emoji':
      content = {
        type: 'paragraph',
        content: [{ type: 'text', text: ':' }],
      }
      break
    case 'heading':
      content = {
        attrs: item.options,
      }
      break
    case 'horizontalRule':
      content = {}
      break
    case 'paragraph':
      content = {
        content: [],
      }
      break
    case 'bulletList':
    case 'orderedList':
      content = {
        content: EmptyListItem,
      }
      break
    case 'taskList':
      content = {
        content: EmptyTaskItem,
      }
      break
    case 'table':
      setTimeout(() => {
        chain
          .insertContentAt(newPos.value, {
            type: 'paragraph',
            content: [],
          })
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .focus()
          .run()
      }, 1)
      return
    case 'image':
      content = {
        type: 'paragraph',
        content: [{ type: item.value, attrs: { src: 'init' } }],
      }
      break
    case 'model-viewer':
      content = { attrs: { src: 'init' } }
      break
    default:
      break
  }

  // add new node
  if (content) {
    content.type = content.type || item.value
    setTimeout(() => {
      if (isEmpty.value) {
        chain.insertContent(content).focus().run()
      } else {
        chain.insertContentAt(newPos.value, content).focus().run()
      }
    }, 1)
  }
  emit('action', item)
}

const isEmpty = computed(() => {
  return props.node.content.size === 0
})

const newPos = computed(() => {
  return isEmpty.value
    ? currentPos.value
    : currentPos.value + props.node.nodeSize
})

onMounted(() => {
  currentPos.value = props.getPos()
})
</script>

<style lang="scss">
.o-add-node-view {
  border-radius: 4px;
  width: 256px;
  font-size: 0.9rem;

  .panel {
    .o-tooltip {
      display: inline-block;
      width: 40px;
      height: 40px;
      padding: 0;

      .o-menubar-btn {
        width: 40px;
        height: 40px;
      }
    }
  }

  .group {
    font-size: 12px;
    padding: 4px 10px;
  }

  .items {
    padding: 0 8px !important;
    margin: 0;
  }

  .item {
    //display: block;
    min-height: 40px !important;
    text-align: left;
    background: transparent;
    border-radius: 3px;
    padding: 4px 8px;
    text-transform: unset;

    &.is-selected {
      border-color: #000;
    }
  }

  .view-emoji {
    header {
      padding: 4px 12px;
      height: unset;
    }
  }
}
</style>
