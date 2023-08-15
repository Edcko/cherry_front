import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import axios from 'axios';
import store from './store'

import 'v-calendar/style.css';
import VCalendar from "v-calendar";

//window.ResizeObserver = null;


loadFonts()

const app = createApp(App);

app.use(VCalendar);
app.use(router);
app.use(vuetify);
app.use(store);

app.provide('$axios', axios); //Proporciona Axios para que este disponible en toda la aplicacion.

const token = localStorage.getItem('token');
if(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}


app.mount('#app');
