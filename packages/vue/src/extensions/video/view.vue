<template>
  <o-node-view
    v-bind="props"
    class="o-video-view"
    :class="{
      readonly: !editor?.isEditable,
      init: src === 'init',
    }"
    as="div"
    @contextmenu.prevent="onContextMenu"
    @click="onClick"
  >
    <o-block-popover
      v-model="showPopover"
      :placement="src === 'init' ? 'bottom' : 'top'"
    >
      <template #popover-content>
        <o-media-input
          :val="src === 'init' ? '' : src"
          type="video"
          @input="onInput"
        />
      </template>

      <o-block-placeholder
        icon="videocam"
        placeholder="Add a video"
        v-if="src === 'init'"
      />
      <div class="video-container" v-else>
        <div class="video-cover"></div>
        <o-block-toolbar v-bind="props" @action="onAction">
          <o-menubar-btn
            icon="subtitles"
            tooltip="image.caption"
            @click="onCaption"
          />
        </o-block-toolbar>
        <video v-bind="node.attrs" draggable="true" data-drag-handle controls>
          <source v-bind="node.attrs" />
        </video>
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
const mouseEvent = ref({})
const captionInput = ref(null)
const showCaptionInput = ref(false)
const showPopover = ref(false)

const caption = computed({
  get() {
    return props.node.attrs.caption
  },
  set(value) {
    props.updateAttributes({ caption: value })
  },
})

const src = computed({
  get() {
    return props.node.attrs.src
  },
  set(value) {
    props.updateAttributes({ src: value })
  },
})

function onAction(action: BlockOption) {
  showContextMenu.value = false
  switch (action.value) {
    case 'replace':
      onShowPopover(true)
      break
  }
}

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
.o-video-view {
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 100%;

  .video-container {
    position: relative;
    overflow: hidden;
    min-height: 40px;
    //background: red;

    .o-block-toolbar {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      z-index: 1;
    }

    .video-covers {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: red;
      z-index: 0;
    }

    video {
      max-height: 100%;
      max-width: 100%;
      border-radius: 3px;
      object-fit: cover;
      vertical-align: middle;
    }

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
  }
}
</style>
