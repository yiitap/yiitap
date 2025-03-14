import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
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
    // we don't minify so we can look at the bundle ouput. Change if you wanna deploy the playground
    minify: false,
    sourcemap: true,
    rollupOptions: {
      // Comment in to move vue out of the bundle - easier to look at the app's bundle content that way.
      // external: ['vue'],
    },
  },
  optimizeDeps: {
    exclude: ['@yiitap/vue'],
  },
})
