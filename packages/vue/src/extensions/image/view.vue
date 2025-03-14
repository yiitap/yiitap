<template>
  <o-node-view
    v-bind="props"
    class="o-image-view"
    :class="{
      'with-caption': attrs.alt,
      'with-ratio': attrs.ratio,
      readonly: !editor?.isEditable,
      init: src === 'init',
    }"
    :size="attrs.size"
    as="div"
    @click="onClick"
  >
    <o-block-popover
      v-model="showPopover"
      :placement="src === 'init' ? 'bottom' : 'top'"
      show-arrow
    >
      <template #popover-content>
        <o-media-input
          :val="src === 'init' ? '' : src"
          type="image"
          @input="onInput"
        />
      </template>

      <o-block-placeholder
        icon="image"
        placeholder="Add an image"
        v-if="src === 'init'"
      />
      <div class="image-container" v-else>
        <o-block-toolbar v-bind="props" @action="onAction">
          <o-menubar-btn
            icon="subtitles"
            tooltip="image.caption"
            @click="onCaption"
          />
        </o-block-toolbar>
        <img v-bind="attrs" draggable="true" data-drag-handle />

        <div class="caption" @click="onCaption">
          <o-input
            ref="captionInput"
            class="caption-input"
            v-model="caption"
            type="text"
            placeholder="Input caption"
            autosize
            @blur="onCaptionInputBlur"
            v-if="editor?.isEditable && showCaptionInput"
          />
          <span v-else>{{ caption }}</span>
        </div>
      </div>
    </o-block-popover>

    <o-context-menu v-model="showContextMenu" :event="mouseEvent">
      <o-block-menu v-bind="props" @action="onAction" />
    </o-context-menu>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import {
  OBlockMenu,
  OBlockPlaceholder,
  OBlockPopover,
  OBlockToolbar,
  OContextMenu,
  OInput,
  OMediaInput,
  OMenubarBtn,
  ONodeView,
} from '../../components/index'

const props = defineProps(nodeViewProps)
const showContextMenu = ref(false)
const showPopover = ref(false)
const mouseEvent = ref({})
const captionInput = ref(null)
const showCaptionInput = ref(false)

const attrs = computed(() => {
  return props.node.attrs
})

const src = computed({
  get() {
    return props.node.attrs.src
  },
  set(value) {
    props.updateAttributes({ src: value })
  },
})

const caption = computed({
  get() {
    return props.node.attrs.title
  },
  set(value) {
    props.updateAttributes({ title: value })
  },
})

function onCaption() {
  showCaptionInput.value = true
  setTimeout(() => {
    captionInput.value?.focus()
  }, 0)
}

function onCaptionInputBlur() {
  showCaptionInput.value = false
}

function onClick() {
  if (src.value === 'init') {
    onShowPopover(true)
  }
}

function onContextMenu(e: MouseEvent) {
  showContextMenu.value = true
  mouseEvent.value = e
}

function onAction(action: BlockOption) {
  showContextMenu.value = false
  switch (action.value) {
    case 'replace':
      onShowPopover(true)
      break
  }
}

function onInput(value: string) {
  src.value = value
  onShowPopover(false)
}

function onShowPopover(value: boolean) {
  showPopover.value = value
}

onMounted(() => {
  onShowPopover(src.value === 'init')
})
</script>

<style lang="scss">
.o-image-view {
  position: relative;
  display: inline-block;
  cursor: pointer;

  &.init {
    width: calc(100% - 1px); // 1px for cursor
  }

  .image-container {
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
    min-height: 40px;

    .caption {
      width: 100%;
      text-align: center;

      .caption-input {
        display: block;
        width: 100%;
        padding: 0;
        caret-color: transparent !important;
        border: none;
        background: transparent !important;

        input {
          font-size: 0.8rem;
          color: var(--yii-caption-color);
          height: unset;
          padding: 0;
        }
      }

      span {
        font-size: 0.8rem;
        color: var(--yii-caption-color);
      }
    }

    .o-block-toolbar {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      z-index: 1;
    }

    img {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
  }
}
</style>
