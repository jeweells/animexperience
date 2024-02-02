import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import react from '@vitejs/plugin-react'
import { normalizePath } from 'vite'
export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(resolve(__dirname, './extensions/**')),
            dest: './'
          }
        ],
        structured: true
      })
    ],
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@components': resolve('src/renderer/src/components'),
        '@reducers': resolve('src/renderer/redux/reducers'),
        '@selectors': resolve('src/renderer/src/selectors'),
        '~': resolve('src/renderer/')
      }
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      })
    ]
  }
})
