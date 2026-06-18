import { createSSRApp } from 'vue'
import App from './App.vue'
import Header from '@/components/header/index.vue'
import PageContainer from '@/components/base/page-container.vue'
import DbbButton from '@/components/dbb-button.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.component('Header', Header)
  app.component('PageContainer', PageContainer)
  app.component('DbbButton', DbbButton)
  return {
    app,
  }
}
