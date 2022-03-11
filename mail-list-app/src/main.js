import { createApp } from 'vue'
import App from './App.vue'
import store from './store/storeMain.js'
import {getWeek} from './assets/js/week'

getWeek()
//const date = new Date();

const app = createApp(App)
app.use(store)
//app.use(date)

store.dispatch('setup')

app.mount('#app')