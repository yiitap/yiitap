import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // we alias to the lib's source files in dev
      // so we don't need to rebuild the lib over and over again
      '@yiitap/vue':
        process.env.NODE_ENV === 'production'
          ? '@yiitap/vue'
          : '@yiitap/vue/src/index.ts',
    },
    dedupe: ['vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          process.env.NODE_ENV === 'production'
            ? `@import '@yiitap/vue/dist/vue.css';`
            : '',
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      external: ['yjs'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('vue')) {
              return 'vendor-framework' // Split React/Vue
            }
            if (id.includes('@yiitap') || id.includes('@tiptap')) {
              return 'vendor-core' // Split tiptap
            }
            if (id.includes('lodash') || id.includes('moment')) {
              return 'vendor-utils' // Split utils
            }
            return 'vendor' // Others
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
  optimizeDeps: {
    exclude: [],
  },
})
