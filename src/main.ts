import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { Buffer } from 'buffer'

// Provide global Buffer and globalThis for web compatibility
;(window as any).Buffer = Buffer
;(window as any).global = window

import 'virtual:uno.css'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
