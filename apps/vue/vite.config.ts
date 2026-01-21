import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

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
  base: '/yiitap/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // we alias to the lib's source files in dev
      // so we don't need to rebuild the lib over and over again
      '@yiitap/vue':
        process.env.NODE_ENV === 'production'
          ? '@yiitap/vue'
          : '@yiitap/vue/src/index.ts',
    },
    dedupe: [
      'vue',
    ],
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
            if (id.includes('katex')) {
              return 'vendor-katex' // Split utils
            }
            if (id.includes('mermaid')) {
              return 'vendor-mermaid' // Split utils
            }
            if (id.includes('cytoscape')) {
              return 'vendor-cytoscape' // Split utils
            }
            if (id.includes('elk')) {
              return 'vendor-elk' // Split utils
            }
            if (id.includes('prosemirror')) {
              return 'vendor-prosemirror' // Split prosemirror
            }
            return 'vendor' // Others
          }
          // if (id.includes("node_modules")) {
          //   return id
          //     .toString()
          //     .split("node_modules/")[1]
          //     .split("/")[0]
          //     .toString();
          // }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
  optimizeDeps: {
    include: ['vue'],
    exclude: [],
  },
})
