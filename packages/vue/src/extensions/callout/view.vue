<template>
  <o-node-view
    v-bind="props"
    class="o-callout-view"
    :style="`--callout-border-color: ${borderColorTheme}; --callout-back-color: ${backColorTheme}`"
    @contextmenu.prevent="onContextMenu"
  >
    <div class="callout-container">
      <o-popover
        ref="iconPopover"
        placement="bottom-start"
        trigger="click"
        :offset="[0, 0]"
        :disable="!isEditable"
      >
        <template #trigger>
          <div class="callout-icon">
            {{ node.attrs.icon }}
          </div>
        </template>

        <o-emoji-select
          :items="emojiGroups"
          @select="onSelect('icon', $event)"
          enable-search
        />
      </o-popover>

      <div class="callout-content">
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
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import {
  OBlockMenu,
  OContextMenu,
  OEmojiSelect,
  ONodeView,
  OPopover,
} from '../../components'
import { useTheme, useTiptap } from '../../hooks'
import { emojiGroups } from '@yiitap/util-emoji'

const props = defineProps(nodeViewProps)

const { theme } = useTheme()
const { isEditable } = useTiptap()
const showContextMenu = ref(false)
const showPopover = ref(false)
const mouseEvent = ref({})
const iconPopover = ref(null)

const isFocused = computed(() => {
  const { selection } = props.editor.view.state
  const pos = selection.from
  const nodeFrom = props.getPos()
  const nodeTo = nodeFrom + props.node.nodeSize
  return pos >= nodeFrom && pos <= nodeTo
})

const backColor = computed({
  get() {
    return props.node.attrs.backColor
  },
  set(value) {
    props.updateAttributes({ backColor: value })
  },
})

const backColorDark = computed({
  get() {
    return props.node.attrs.backColorDark
  },
  set(value) {
    props.updateAttributes({ backColorDark: value })
  },
})

const borderColor = computed({
  get() {
    return props.node.attrs.borderColor
  },
  set(value) {
    props.updateAttributes({ borderColor: value })
  },
})

const borderColorDark = computed({
  get() {
    return props.node.attrs.borderColorDark
  },
  set(value) {
    props.updateAttributes({ borderColorDark: value })
  },
})

const backColorTheme = computed(() => {
  return theme.value === 'dark' ? backColorDark.value : backColor.value
})

const borderColorTheme = computed(() => {
  return theme.value === 'dark' ? borderColorDark.value : borderColor.value
})

function setIcon(icon) {
  props.updateAttributes({ icon: icon })
}

function onAction(action: BlockOption) {
  showContextMenu.value = false
  switch (action.value) {
    case 'palette':
      onShowPopover(true)
      break
  }
}

function onContextMenu(e: MouseEvent) {
  showContextMenu.value = true
  mouseEvent.value = e
}

function onShowPopover(value: boolean) {
  showPopover.value = value
}

function onSelect(command: string, value: any) {
  switch (command) {
    case 'backColor':
      backColor.value = value
      break
    case 'foreColor':
      borderColor.value = value
      break
    case 'icon':
      setIcon(value.emoji)
      iconPopover.value?.setShow(false)
      break
  }
}

watch(isFocused, (newValue) => {
  // console.log('isFocused', props.node.attrs)
  onShowPopover(newValue)
})
</script>

<style lang="scss">
.o-callout-view {
  position: relative;
  border-radius: 4px;
  padding: 12px;
  margin: 4px 0;
  background: var(--callout-back-color);
  border: solid 1px var(--callout-border-color);

  .callout-container {
    display: flex;

    .o-popover {
      height: 36px;
    }
  }

  .callout-icon {
    height: 36px;
    width: 36px;
    font-size: 28px;
    text-align: center;
    line-height: 36px;
    color: black;
    z-index: 2;
    margin-right: 12px;

    &:hover {
      background: rgba(#000000, 0.1);
      //background: red;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .callout-content {
    flex: 1 1 auto;
  }
}

.o-callout-popover {
  padding: 0 !important;
  top: -14px;
  right: -12px;
  min-width: 200px;
  box-shadow: none !important;
  background: transparent !important;

  .n-popover__content {
    display: flex;
    justify-content: flex-end;
  }
}

.o-callout-action {
  border-radius: 4px;
  padding: 4px;
}
</style>
