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

export * from './components'
export * from './constants'
export * from './hooks'
// export * from './extensions'
