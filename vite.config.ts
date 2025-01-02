import { createLogger, defineConfig, type Logger } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import { createMpaPlugin } from 'vite-plugin-virtual-mpa'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
const customLogger = (): Logger => {
  const logger = createLogger()
  return {
    ...logger,
    warn: (message, options) => {
      const regexp = /Files in the public directory are served at the root path./g
      if (regexp.test(message)) return
      logger.info(message, options)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  customLogger: customLogger(),
  plugins: [
    nodePolyfills(),
    vue(),
    tsconfigPaths(),
    createMpaPlugin({
      verbose: false,
      template: 'public/index.html',
      pages: [{ name: 'index', filename: 'index.html' }],
      rewrites: [{ from: /^(?!.*charting_library).*$/i, to: '/public/index.html' }],
    }),
  ],
  server: {
    open: true,
    cors: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // manualChunks: {
        //   'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        //   'vendor-utils': ['ahooks', 'axios', 'dayjs', 'jotai', 'js-cookie', 'lodash-es'],
        //   'vendor-ui': ['framer-motion', 'mac-scrollbar', 'qrcode-generator', 'styled-components'],
        // },
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
})
