import type { App } from 'vue'
import YiiEditor from './components/YiiEditor.vue'

const YiiEditorPlugin = {
  installed: false,
  spellcheck: true,
  install(app: App) {
    this.installed = true
    app.component('YiiEditor', YiiEditor)
  },
}

export { YiiEditor, YiiEditorPlugin }

export * from './components/index'
export * from './hooks/index'
