import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

export default mergeConfig(
  defineConfig({
    build: {
      target: 'esnext',
      lib: {
        name: 'Shortcut',
        entry: 'src/index.ts',
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
      rollupOptions: {
        external: [
          '@tiptap/core',
          '@tiptap/markdown',
          '@tiptap/pm/model',
          '@tiptap/pm/state',
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
            '@tiptap/core': 'TiptapCore',
            '@tiptap/markdown': 'TiptapMarkdown',
            '@tiptap/pm/model': 'TiptapPmModel',
            '@tiptap/pm/state': 'TiptapPmState',
          },
        },
      },
    },
    plugins: [],
  }),
  defineVitestConfig({
    test: {
      environment: 'jsdom',
    },
  })
)
