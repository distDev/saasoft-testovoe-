import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAccountsStore } from './stores/accounts'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

useAccountsStore(pinia).init()

app.mount('#app')
