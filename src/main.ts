import './assets/index.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// @ts-ignore 忽略 App.vue 模块的类型检查
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
