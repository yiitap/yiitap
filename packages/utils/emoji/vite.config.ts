import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

export default mergeConfig(
  defineConfig({
    resolve: {},
    build: {
      target: 'esnext',
      lib: {
        name: 'EmojiUtil',
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
        external: [],
        output: {
          banner: `
/**
 *  Copyright ${new Date(Date.now()).getFullYear()} Yiitap 
 *  @license MIT
**/
`,
          exports: 'named',
          globals: {},
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
