<template>
  <o-list class="drag-node-menu" hoverable clickable>
    <template v-if="actions.length">
      <template v-for="(item, index) in actions" :key="index">
        <template v-if="item.group">
          <o-divider v-if="index > 0" />
          <div class="group o-tips" v-if="showGroup">{{ tr(item.group) }}</div>
        </template>
        <o-popover
          :ref="popovers[item.value]"
          :offset="[0, 16]"
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
import { computed, ref } from 'vue'
import { Editor } from '@tiptap/core'
import useI18n from '../../../hooks/useI18n'
import {
  OCalloutColorBoard,
  ODivider,
  OIcon,
  OList,
  OListItem,
  OPopover,
} from '../../../components/index'
import { BlockMenus } from '../../../constants/block'

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
  node: {
    type: Object,
  },
  pos: {
    type: Number,
  },
  deleteNode: {
    type: Function,
    required: true,
  },
  updateAttributes: {
    type: Function,
    required: true,
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
const popovers = ref([])

const { tr } = useI18n()

const nodeType = computed(() => {
  return props.node?.type.name
})

const actions = computed(() => {
  const commonActions = BlockMenus.filter(
    (e: BlockOption) => e.filter.indexOf('common') >= 0
  )
  const nodeActions = BlockMenus.filter(
    (e: BlockOption) => e.filter.indexOf(nodeType.value) >= 0
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
  switch (item.value) {
    case 'delete':
      props.deleteNode()
      break
    case 'duplicate':
      onDuplicate()
      break
  }
  emit('action', item)
}

function onDuplicate() {
  const nodeSize = props.node?.nodeSize
  const newPos = props.pos + nodeSize
  const json = JSON.parse(JSON.stringify(props.node))
  props.editor?.commands.insertContentAt(newPos, json)
}

function onSelect(item: Indexable, value: Indexable) {
  switch (value.name) {
    case 'backColor':
      props.updateAttributes({ background: value.value })
      break
    case 'foreColor':
      props.updateAttributes({ borderColor: value.value })
      break
  }
}
</script>

<style lang="scss">
.drag-node-menu {
  .item {
    .suffix {
      font-size: 10px;
    }
  }
}
</style>
