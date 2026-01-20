<template>
  <section class="page-demo" :class="{ dark: darkMode }">
    <section class="layout-toolbar">
      <header>
        <section class="info">
          <div class="logo">
            <a href="https://yiitap.pileax.ai" target="_blank">
              <img src="/logo.png" alt="Logo" />
            </a>
          </div>
          <div class="title">Yiitap</div>
          <div class="version">
            <version-badge package="@yiitap/vue" />
          </div>
        </section>
        <section class="actions">
          <n-button quaternary @click="onGithub">
            <o-icon name="github" />
          </n-button>
          <n-button quaternary @click="onToggleDrawer">
            <o-icon name="settings" />
          </n-button>
        </section>
      </header>
      <div class="toolbar">
        <o-main-menu
          :editor="yiiEditor?.editor"
          :menu="editorOptions.mainMenu"
          :data-theme="darkMode ? 'dark' : ''"
        />
      </div>
    </section>
    <section class="layout-content" @scroll="onScroll">
      <YiiEditor ref="yiiEditor" v-bind="editorOptions" @update="onUpdate" />
    </section>

    <n-drawer
      v-model:show="showDrawer"
      :default-width="400"
      placement="right"
      resizable
    >
      <n-drawer-content title="Yii Editor" closable>
        <n-form ref="form" label-placement="left" label-width="auto">
          <h3>General</h3>
          <n-divider />
          <n-form-item label="Language">
            <n-radio-group v-model:value="locale" name="radiogroup1">
              <n-space>
                <n-radio value="en"> English </n-radio>
                <n-radio value="zh"> 中文 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="Mode">
            <n-switch v-model:value="darkMode" @update:value="onMode">
              <template #checked> Dark </template>
              <template #unchecked> Light </template>
            </n-switch>
          </n-form-item>
          <n-form-item label="Edit">
            <n-switch v-model:value="editable">
              <template #checked> Editable </template>
              <template #unchecked> Readonly </template>
            </n-switch>
          </n-form-item>

          <h3>AI</h3>
          <n-divider />
          <n-form-item label="AI Provider">
            <n-select
              v-model:value="aiOption.provider"
              :options="aiProviders"
            />
          </n-form-item>
          <n-form-item label="Base URL" v-if="aiOption.provider === 'custom'">
            <n-input v-model:value="aiOption.baseURL" placeholder="baseURL" />
          </n-form-item>
          <n-form-item label="API Key">
            <n-input v-model:value="aiOption.apiKey" placeholder="apiKey" />
          </n-form-item>
        </n-form>
      </n-drawer-content>
    </n-drawer>

    <o-doc-toc
      ref="tocRef"
      :editor="yiiEditor?.editor"
      :max-level="3"
      @doc-scroll="onDocScroll"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, provide, ref, onMounted, watch } from 'vue'
import {
  NButton,
  NDivider,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
} from 'naive-ui'
import { YiiEditor, ODocToc, OIcon, OMainMenu } from '@yiitap/vue'
import { BasicFeaturesArticle, BasicFeaturesArticleZh } from '@/data/article'
import 'katex/dist/katex.min.css'

import VersionBadge from './VersionBadge.vue'

const emit = defineEmits(['mode'])

const yiiEditor = ref<InstanceType<typeof YiiEditor>>()
const tocRef = ref<InstanceType<typeof ODocToc>>()
const locale = ref('en')
const darkMode = ref(false)
const editable = ref(true)
const aiOption = ref<AiOption>({
  provider: 'deepseek',
})
const showDrawer = ref(false)
provide('locale', locale)

const editorOptions = computed(() => {
  return {
    title: true,
    aiOption: aiOption.value,
    locale: locale.value,
    darkMode: darkMode.value,
    editable: editable.value,
    content: content.value,
    showMainMenu: false,
    showBubbleMenu: true,
    showFloatingMenu: true,
    sideMenu: {
      show: true,
      add: 'menu',
    },
    // showSideNode: true,
    pageView: 'page',
    mainMenu: [
      'bold',
      'italic',
      'text-format-dropdown',
      'separator',
      'heading',
      'font-family',
      'text-color-dropdown',
      'color',
      'background-color',
      'highlight',
      'clearFormat',
      'separator',
      'align-dropdown',
      'separator',
      'horizontalRule',
      'blockquote',
      'details',
      'list-dropdown',
      'codeBlock',
      'link',
      'image',
      'video',
      'table',
      'callout',
      'emoji',
      'aiBlock',
      'separator',
      'inlineMath',
      'blockMath',
      'diagram',
    ],
    extensions: [
      // 'BlockMath',
      // 'Emoji',
      'InlineMath',
      'Markdown',
      'OAiBlock',
      'OBlockMath',
      'OBlockquote',
      'OCallout',
      'OCodeBlock',
      'OColon',
      'OColorHighlighter',
      'ODetails',
      'OHeading',
      'OImage',
      // 'OInlinePlaceholder',
      'OLink',
      'OParagraph',
      'OShortcut',
      'OSlash',
      'OSlashZh',
      'OVideo',
      'OTrailingNode',
    ],
  }
})

const content = computed(() => {
  return locale.value === 'zh' ? BasicFeaturesArticleZh : BasicFeaturesArticle
  // return ''
})

const aiProviders = computed(() => {
  return [
    {
      label: 'OpenAI',
      value: 'openai',
      baseURL: '',
    },
    {
      label: 'DeepSeek',
      value: 'deepseek',
      baseURL: 'https://api.deepseek.com/v1',
    },
    {
      label: 'Custom',
      value: 'custom',
      baseURL: '',
    },
  ]
})

function init() {
  try {
    locale.value = localStorage.getItem('yiitap.locale') || 'en'
    const aiOptionString = localStorage.getItem('yiitap.ai.option')
    if (aiOptionString) {
      aiOption.value = JSON.parse(aiOptionString)
    }
  } catch (e) {
    // ignore
  }
}

function onToggleDrawer() {
  showDrawer.value = !showDrawer.value
}

function onGithub() {
  window.open('https://github.com/yiitap/yiitap', '_blank')
}

function onMode() {
  emit('mode', darkMode.value)
}

function onUpdate({ json, html }: { json: any; html: string }) {
  // Get content of editor
  // console.log(json)
  // console.log(html)

  // markdown
  const markdown = yiiEditor.value?.editor.markdown.serialize(json)
  // console.log(markdown)
}

function onScroll(event: Event) {
  // tocRef.value?.onScroll(event)
}

function onDocScroll(event: Event) {
  // If docScroll event not emitted, use tocRef.value?.onScroll(event) to update toc progress when scrolling.
  // console.debug('docScroll', event)
}

watch(locale, (newValue) => {
  yiiEditor.value?.editor.commands.setContent(content.value, {
    emitUpdate: true,
  })
  localStorage.setItem('yiitap.locale', newValue)
})

watch(
  aiOption,
  (newValue) => {
    localStorage.setItem('yiitap.ai.option', JSON.stringify(aiOption.value))
  },
  { deep: true }
)

onMounted(() => {
  // initialization
  init()

  // Access properties exposed by YiiEditor
  // console.debug('editor', yiiEditor.value?.editor)
  // console.debug('darkMode', yiiEditor.value?.darkMode)
  // console.debug('local', yiiEditor.value?.local)

  // console.log('extensions', yiiEditor.value?.editor.extensionManager.extensions)
})
</script>

<style lang="scss">
.page-demo {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  color: var(--yii-color-accent);
  background: var(--yii-bg-color);

  .layout-toolbar {
    height: 108px;
    header {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;

      .info {
        display: flex;
        align-items: center;
        .logo {
          width: 32px;
          height: 32px;
        }
        img {
          width: 100%;
          height: 100%;
        }

        .title {
          padding: 0 4px;
          font-size: 20px;
        }

        .version {
          height: 20px;
          img {
            width: unset;
            height: 100%;
          }
        }
      }

      .actions {
        display: flex;
        align-items: center;

        .n-button {
          padding: 0 8px;
          margin-left: 4px;
        }
      }
    }

    .toolbar {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: solid 1px rgba(0, 0, 0, 0.05);
      border-bottom: solid 1px rgba(0, 0, 0, 0.05);
      box-sizing: border-box;
    }
  }

  .layout-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 108px;
    bottom: 0;
    overflow: auto;
  }

  .o-doc-toc {
    position: absolute;

    top: 116px;
    right: 10px;
  }
}

.n-drawer {
  .action {
    margin-bottom: 14px;
  }
}

*:has(.is-dragging) {
  background: transparent !important;
}

::-webkit-scrollbar {
  width: 6px;
  background-color: var(--yii-bg-color);
}

::-webkit-scrollbar-thumb {
  background-color: var(--yii-caption-color);
  width: 4px;
  border-radius: 3px;
}
</style>
