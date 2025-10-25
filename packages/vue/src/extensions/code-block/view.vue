<template>
  <o-node-view
    v-bind="props"
    class="o-code-block-view"
    :class="`language-${language} ${codeView}`"
  >
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
        <o-code-block-view-dropdown
          v-model="view"
          class="editable"
          v-if="codeView"
        />
        <o-menubar-btn
          :icon="wrapIcon"
          :icon-class="{ 'rotate-270': wrap }"
          tooltip="Wrap"
          class="editable"
          @click="onWrap"
        />
        <o-code-block-download-dropdown
          @download="onDownload"
          v-if="canPreview"
        />
        <o-menubar-btn
          icon="download"
          :tooltip="tr('label.download')"
          @click="onDownload"
          v-else
        />
        <o-menubar-btn
          icon="play_circle"
          tooltip="Run"
          @click="onRun"
          v-if="runnable"
        />
        <o-menubar-btn
          :icon="copyIcon"
          :tooltip="tr('label.copy')"
          @click="onCopy"
        />
      </div>
    </div>
    <o-dialog v-model:show="showDialog">
      <template #title>Run</template>

      <iframe sandbox="allow-same-origin allow-scripts" :srcdoc="html">
      </iframe>
    </o-dialog>

    <pre><node-view-content as="code" :class="{'wrap': wrap}" /></pre>
    <section class="preview" v-if="canPreview">
      <div class="error" v-if="error">
        {{ error }}
      </div>
      <div class="mermaid-svg" v-html="mermaidSvg" v-else />
    </section>
  </o-node-view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import mermaid from 'mermaid'
import { copyToClipboard } from '@yiitap/core'
import {
  OCodeBlockDownloadDropdown,
  OCodeBlockViewDropdown,
  OLanguageDropdown,
  OMenubarBtn,
  ONodeView,
  ODialog,
} from '../../components/index'
import { Languages } from '../../constants/language'
import { useCommon, useI18n, useTheme, useTiptap } from '../../hooks'

const props = defineProps(nodeViewProps)
const { commonDownload } = useCommon()
const { tr } = useI18n()
const { darkMode } = useTheme()
const { isEditable } = useTiptap()

const copyIcon = ref('content_copy')
const showDialog = ref(false)
const html = ref('')

// mermaid
const mermaidSvg = ref('')
const error = ref('')
const view = ref('splitVertical')
const diagramTheme = ref('default')

const language = computed({
  get() {
    return props.node.attrs.language
  },
  set(language) {
    props.updateAttributes({ language })
  },
})

const code = computed(() => {
  return props.node.content.content[0]?.text || ''
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

const canPreview = computed(() => {
  return language.value === 'mermaid'
})

const codeView = computed(() => {
  return language.value === 'mermaid'
    ? isEditable.value
      ? view.value
      : 'preview'
    : ''
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

function onDownload(type = 'code') {
  switch (type) {
    case 'svg':
      downloadSvg()
      break
    default:
      downloadCode()
      break
  }
}

function downloadCode() {
  const name = language.value
  let ext = name
  const lang = Languages.find((e) => e.value === name)
  if (lang) {
    ext = lang.ext.at(0)
  }

  const fileName = `${name}-${Date.now()}.${ext}`
  const text = props.node.content.content[0].text
  commonDownload('code', fileName, text)
}

function downloadSvg() {
  console.log('download', 'svg')
  if (!mermaidSvg.value) {
    return
  }
  const fileName = `mermaid-${Date.now()}.svg`
  const text = mermaidSvg.value
  commonDownload('svg', fileName, text)
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

function onRender() {
  switch (language.value) {
    case 'mermaid':
      renderMermaid()
      break
    default:
      break
  }
}

function onRerender() {
  mermaid.initialize({
    theme: darkMode.value ? 'dark' : (diagramTheme.value as 'default'),
  })
  onRender()
}

async function renderMermaid() {
  try {
    error.value = ''
    const id = `mermaid-${Date.now()}`
    const { svg } = await mermaid.render(id, code.value)
    mermaidSvg.value = svg
  } catch (err) {
    console.error(err)
    error.value = err.message
  }
}

watch(code, (newValue) => {
  onRender()
})

watch(language, (newValue) => {
  onRender()
})

watch(darkMode, (newValue) => {
  onRerender()
})

onMounted(() => {
  const ext = props.editor.extensionManager.extensions.find(
    (e) => e.name === 'codeBlock'
  )
  diagramTheme.value = ext?.options?.diagramTheme || 'default'
  onRerender()
})
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

  .preview {
    border-radius: 0 0 5px 5px;
    //background: var(--yii-pre-bg-color);
    //border-top: dashed 1px var(--yii-code-bg-color);
    text-align: center;
    padding: 10px 0;
    .error {
      text-align: left;
    }

    .mermaid-svg {
      display: flex;
      justify-content: center;

      svg {
        display: block;
      }
    }

    .error {
      display: flex;
      padding: 0 1rem;
      font-size: 0.9rem;
      color: var(--yii-brand-red);
    }
  }

  &.code {
    .preview {
      display: none;
    }
  }

  &.preview {
    .code-block-toolbar {
      border-radius: 5px !important;
    }

    pre {
      display: none;
    }

    .preview {
      border: none;
    }
  }

  &.splitHorizontal {
    position: fixed;
    background: var(--yii-pre-bg-color);
    inset: 0;
    margin: 0;
    display: flex;
    align-items: center;
    z-index: 100;

    .code-block-toolbar {
      position: absolute;
      top: 10px;
      right: 10px;
      border-radius: 5px !important;
    }

    pre {
      display: block;
      width: 40%;
      max-width: 800px;
      height: 100vh;
      background: var(--yii-pre-bg-color);

      code {
        padding: 1rem 0;
      }
    }

    .preview {
      flex: 1;
      height: 100vh;
      background: blue;
      display: flex;
      justify-content: center;
      background: var(--yii-bg-color);

      div {
        padding: 1rem;

        &.error {
          padding: 56px 1rem;
        }
      }
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

  .o-code-block-view.language-mermaid {
    .code-block-toolbar {
      visibility: hidden;
    }

    .preview {
      margin-top: -40px;
    }

    &:hover {
      .code-block-toolbar {
        visibility: visible;
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
