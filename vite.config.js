import { spawnSync } from 'node:child_process'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Uni from '@uni-helper/plugin-uni'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

function syncCloudfunctionsPlugin() {
  return {
    name: 'sync-cloudfunctions',
    closeBundle() {
      if (process.env.UNI_PLATFORM !== 'mp-weixin') return
      spawnSync('node', ['scripts/sync-cloudfunctions.mjs'], {
        cwd: projectRoot,
        stdio: 'inherit',
      })
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    // https://uni-helper.js.org/plugin-uni
    Uni(),
    syncCloudfunctionsPlugin(),
  ],
  
})


