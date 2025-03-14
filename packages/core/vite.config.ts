import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'
import path from 'path'

export default mergeConfig(
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'esnext',
      lib: {
        name: 'YiitapCore',
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
        external: ['@tiptap/core'],
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
