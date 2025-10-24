<template>
  <o-node-view
    v-bind="props"
    class="o-block-math-view"
    :class="{
      init: !latex,
    }"
    as="div"
    @click="onShowPopover(true)"
  >
    <o-block-popover
      v-model="showPopover"
      content-class="o-block-math-editor"
      :placement="latex === 'init' ? 'bottom' : 'top'"
      :readonly="!isEditable"
      show-arrow
    >
      <template #popover-content>
        <header class="header o-tips">
          <div style="display: flex">
            <o-icon name="functions" />
            {{ tr('editor.blockMath') }}
          </div>
          <div>
            <o-command-btn
              icon="help"
              :tooltip="tr('label.help')"
              @click="onHelp"
            />
          </div>
        </header>
        <o-textarea
          ref="input"
          v-model="latex"
          placeholder="Input block math ..."
          autofocus
          clearable
        />
      </template>

      <o-block-placeholder
        class="o-tips"
        icon="functions"
        placeholder="Add a TeX equation"
        v-if="!latex"
      />
      <div class="block-math-container" @click="onShowPopover(true)" v-else>
        <div class="katex-container" v-html="rendered"></div>
      </div>
    </o-block-popover>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import katex from 'katex'
import { nodeViewProps } from '@tiptap/vue-3'
import useI18n from '../../hooks/useI18n'
import { useTiptap } from '../../hooks'
import {
  OBlockPlaceholder,
  OBlockPopover,
  OTextarea,
  ONodeView,
  OCommandBtn,
  OIcon,
} from '../../components/index'

const props = defineProps(nodeViewProps)

const { tr } = useI18n()
const { isEditable } = useTiptap()
const showPopover = ref(false)
const input = ref(null)

const latex = computed({
  get() {
    return props.node.attrs.latex
  },
  set(value) {
    props.updateAttributes({ latex: value || '' })
  },
})

const rendered = computed(() => {
  return katex.renderToString(latex.value, { throwOnError: false })
})

function onShowPopover(value: boolean) {
  showPopover.value = value

  if (value) {
    setTimeout(() => {
      input.value?.focus()
    }, 100)
  }
}

function onHelp() {
  window.open('https://katex.org/docs/supported.html', 'target')
}

onMounted(() => {
  onShowPopover(!latex.value)
})
</script>

<style lang="scss">
.o-block-math-view {
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: var(--yii-hover-bg-color);
    border-radius: 4px;
  }

  &.init {
    width: calc(100% - 1px); // 1px for cursor
  }

  .block-math-container {
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;

    .katex-container {
      margin: 1rem 0;
      text-align: center;
    }
  }
}

.o-block-math-editor {
  min-width: 480px !important;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .o-textarea {
    outline: none !important;

    &__prefix {
      display: none;
    }

    &:has(textarea:focus) {
      background: rgba(0, 0, 0, 0.02) !important;
      border-radius: 4px;
    }

    textarea {
      min-height: calc(1.5em * 4);
    }
  }
}
</style>
