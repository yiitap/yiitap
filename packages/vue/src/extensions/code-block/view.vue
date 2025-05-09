<template>
  <o-node-view v-bind="props" class="o-code-block-view">
    <div class="code-block-toolbar">
      <div class="wrap">
        <div class="language readonly">{{ language }}</div>
        <o-language-dropdown
          :language="language"
          class="editable"
          @select="onSelectLanguage"
        />
      </div>
      <div class="wrap">
        <o-menubar-btn
          :icon="wrapIcon"
          :icon-class="{ 'rotate-270': wrap }"
          tooltip="Wrap"
          class="editable"
          @click="onWrap"
        />
        <o-menubar-btn icon="download" tooltip="Download" @click="onDownload" />
        <o-menubar-btn
          icon="play_circle"
          tooltip="Run"
          @click="onRun"
          v-if="runnable"
        />
        <o-menubar-btn :icon="copyIcon" tooltip="Copy" @click="onCopy" />
      </div>
    </div>
    <o-dialog v-model:show="showDialog">
      <template #title>Run</template>

      <iframe sandbox="allow-same-origin allow-scripts" :srcdoc="html">
      </iframe>
    </o-dialog>

    <pre><node-view-content as="code" :class="{'wrap': wrap}" /></pre>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { copyToClipboard } from '@yiitap/core'
import {
  OLanguageDropdown,
  OMenubarBtn,
  ONodeView,
  ODialog,
} from '../../components/index'
import { Languages } from '../../constants/language'

const props = defineProps(nodeViewProps)
const copyIcon = ref('content_copy')
const showDialog = ref(false)
const html = ref('')

const language = computed({
  get() {
    return props.node.attrs.language
  },
  set(language) {
    props.updateAttributes({ language })
  },
})

const wrap = computed({
  get() {
    return props.node.attrs.wrap
  },
  set(wrap) {
    props.updateAttributes({ wrap })
  },
})

const runnable = computed(() => {
  const list = ['html', 'svg']
  return list.includes(language.value)
})

const wrapIcon = computed(() => {
  return wrap.value ? 'text_select_move_down' : 'format_text_wrap'
})

function onSelectLanguage(value: string) {
  language.value = value
}

function onCopy() {
  const text = props.node.content.content[0].text
  copyToClipboard(text).then(() => {
    copyIcon.value = 'done'
    setTimeout(() => {
      copyIcon.value = 'content_copy'
    }, 2000)
  })
}

function onDownload() {
  const name = language.value
  let ext = name
  const lang = Languages.find((e) => e.value === name)
  if (lang) {
    ext = lang.ext.at(0)
  }

  const text = props.node.content.content[0].text
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}-${Date.now()}.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

function onRun() {
  const code = props.node.content.content[0].text
  html.value = buildHtml(code)
  showDialog.value = true
}

function buildHtml(code: string) {
  return `
    <style>
      body { margin: 0 !important; padding: 0; }
    </style>
    ${code}
  `
}

function onWrap() {
  wrap.value = !wrap.value
}
</script>

<style lang="scss">
.o-code-block-view {
  position: relative;
  margin: 4px 0;
  user-select: text !important;
  pre {
    border-radius: 0 0 5px 5px !important;
  }

  .code-block-toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    height: 40px;
    padding: 0;
    border-radius: 5px 5px 0 0 !important;
    background: var(--yii-pre-tool-bg-color);
    z-index: 1;

    .wrap {
      display: flex;
      align-items: center;
    }

    .readonly {
      display: none;
    }

    .o-btn {
      border-radius: 0;
      height: 40px;
      width: 40px;
      padding: 0 10px;

      &.o-dropdown-btn {
        width: unset;
        border-radius: 5px 0 0 0 !important;
      }
    }

    .o-tooltip {
      &:last-child {
        .o-btn {
          border-radius: 0 5px 0 0 !important;
        }
      }
    }
  }

  .o-dialog {
    .dialog-box {
    }
  }
}

.tiptap[contenteditable='false'] {
  .o-code-block-view {
    .code-block-toolbar {
      .editable {
        display: none;
      }
      .readonly {
        display: block;
      }

      .language {
        padding: 0 12px;
      }
    }
  }
}
</style>
