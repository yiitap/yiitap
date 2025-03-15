/// <reference types="vitest"/>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue(),
    Inspect({
      build: true,
      outputDir: '.analysis/inspect',
    }),
    visualizer({
      filename: '.analysis/visualizer/stats.html',
    }),
  ],
  resolve: {
    alias: {
      /*
       * We recommend to not use aliases in the lib's source,
       * because they will leak into the generated d.ts files and then
       * break the lib's types in the consuming app.
       */
    },
  },
  build: {
    lib: {
      name: 'YiiEditor',
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.mjs'
          case 'cjs':
            return 'index.cjs'
          case 'iife':
            return 'index.js'
          default:
            return 'index.js'
        }
      },
    },
    minify: true,
    sourcemap: true,
    rollupOptions: {
      external: [
        'vue',
        // TODO: Trying to make @tiptap/core external, but encounter:
        //   RangeError: Adding different instances of a keyed plugin
        // '@tiptap/core',
        // '@tiptap/pm',
        // '@tiptap/vue-3',
        '@yiitap/util-emoji',
      ],
      output: {
        banner: `
/**
 *  Copyright ${new Date(Date.now()).getFullYear()} Yiitap 
 *  @license MIT
**/
`,
        exports: 'named',
        globals: {
          vue: 'Vue',
          // '@tiptap/core': 'TiptapCore',
          // '@tiptap/pm': 'TiptapPm',
          // '@tiptap/vue-3': 'TiptapVue3',
          '@yiitap/util-emoji': 'EmojiUtil'
        },
      },
    },
  },
})
