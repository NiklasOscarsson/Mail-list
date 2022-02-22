import { createApp } from 'vue'
import App from './App.vue'
import store from './store/storeMain.js'

const app = createApp(App)
app.use(store)

store.dispatch('setup')

app.mount('#app')