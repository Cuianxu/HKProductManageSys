import './assets/index.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// @ts-ignore 忽略 App.vue 模块的类型检查
import App from './App.vue'
import router from './router'

// 全局组件注册
import SearchForm from './globalComponents/SearchForm.vue'
import TableView from './globalComponents/TableView.vue'



const app = createApp(App)
app.component('SearchForm', SearchForm).component('TableView', TableView)


app.use(createPinia())
app.use(router)

app.mount('#app')
