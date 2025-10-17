<template>
  <o-list class="o-block-menu" hoverable clickable>
    <template v-if="actions.length">
      <template v-for="(item, index) in actions" :key="index">
        <template v-if="item.group">
          <o-divider v-if="index > 0" />
          <div class="group o-tips" v-if="showGroup">
            {{ tr(item.group) }}
          </div>
        </template>

        <o-popover
          :ref="popovers[item.value]"
          :offset="[0, 4]"
          placement="right"
          v-if="getComponent(item)"
        >
          <template #trigger>
            <o-list-item class="item" clickable>
              <template #prefix>
                <o-icon :name="item.icon" :color="colorful ? item.color : ''" />
              </template>
              <template #suffix>
                <o-icon name="navigate_next" class="o-tips" />
              </template>

              {{ tr(item.label) }}
            </o-list-item>
          </template>

          <component
            :is="getComponent(item)"
            @select="onSelect(item, $event)"
          />
        </o-popover>
        <o-list-item class="item" clickable @click="onClick(item)" v-else>
          <template #prefix>
            <o-icon :name="item.icon" :color="colorful ? item.color : ''" />
          </template>
          <template #suffix>
            <div class="suffix o-tips">{{ item.tips }}</div>
          </template>

          {{ tr(item.label) }}
        </o-list-item>
      </template>
    </template>
    <div class="item" v-else>No result</div>
  </o-list>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue'
import useI18n from '../../hooks/useI18n'
import {
  OCalloutColorBoard,
  ODivider,
  OIcon,
  OList,
  OListItem,
  OPopover,
} from '../../components/index'
import { BlockMenus } from '../../constants/block'
import type { NodeViewProps } from '@tiptap/core'

const props = defineProps({
  editor: {
    type: Object as PropType<NodeViewProps['editor']>,
    required: true as const,
  },
  node: {
    type: Object as PropType<NodeViewProps['node']>,
    required: true as const,
  },
  getPos: {
    type: Function as PropType<NodeViewProps['getPos']>,
    required: true as const,
  },
  updateAttributes: {
    type: Function as PropType<NodeViewProps['updateAttributes']>,
    required: true as const,
  },
  deleteNode: {
    type: Function as PropType<NodeViewProps['deleteNode']>,
    required: true as const,
  },
  colorful: {
    type: Boolean,
    default: false,
  },
  showGroup: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['action'])

const { tr } = useI18n()
const popovers = ref([])

const nodeType = computed(() => {
  return props.node?.type.name
})

const actions = computed(() => {
  const commonActions = BlockMenus.filter(
    (e) => e.filter?.indexOf('common') >= 0
  )
  const nodeActions = BlockMenus.filter(
    (e) => e.filter?.indexOf(nodeType.value) >= 0
  )
  if (nodeActions.length > 0) {
    const firstAction = nodeActions[0]
    firstAction.group = `editor.${nodeType.value}`
  }
  return [...commonActions, ...nodeActions]
})

function getComponent(item: Indexable) {
  switch (item.component) {
    case 'OCalloutColorBoard':
      return OCalloutColorBoard
    default:
      return null
  }
}

function onClick(item: Indexable) {
  emit('action', item)
  setTimeout(() => {
    onAction(item)
  }, 0)
}

function onAction(item: Indexable) {
  switch (item.value) {
    case 'delete':
      props.deleteNode()
      break
    case 'duplicate':
      onDuplicate()
      break
  }
}

function onDuplicate() {
  const nodeSize = props.node.nodeSize
  const newPos = props.getPos() + nodeSize
  const json = JSON.parse(JSON.stringify(props.node))
  props.editor?.commands.insertContentAt(newPos, {
    type: 'paragraph',
  })
  props.editor?.commands.insertContentAt(newPos, json)

  const size = newPos + nodeSize + 1
  props.editor?.commands.focus(size)
}

function onSelect(item: Indexable, value: Indexable) {
  console.log('select', item, value)
  switch (value.name) {
    case 'backColor':
      props.updateAttributes({ backColor: value.value })
      break
    case 'foreColor':
      props.updateAttributes({ borderColor: value.value })
      break
  }
}
</script>

<style lang="scss">
.o-block-menu {
  padding-inline-start: 0 !important;
  margin-block-start: 0 !important;
  margin-block-end: 0 !important;

  .o-list-item__suffix {
    display: flex;
  }

  .item {
    .suffix {
      display: flex;
      flex-wrap: nowrap;
      font-size: 10px;
    }
  }
}
</style>
