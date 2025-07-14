import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import axios from 'axios';
import store from './store'
import PDFConfirmationDialog from './components/PDFConfirmationDialog.vue'
import AbonarCompraDialog from './components/AbonarCompraDialog.vue'

import 'v-calendar/style.css';
import VCalendar from "v-calendar";

//window.ResizeObserver = null;

//1. imoprta el plugin
import VueApexCharts from 'vue3-apexcharts'

loadFonts()

const app = createApp(App);

// le damos un prefix para que sus componentes pasen a llamarse <vcal-date-picker>, <vcal-calendar>...
app.use(VCalendar, {
  componentPrefix: 'vcal' 
})
app.use(router);
app.use(vuetify);
app.use(store);

//3. Regustra ApexCharts como un componente global
// Ahora:
app.use(VueApexCharts);
app.component("ApexChart", VueApexCharts);

// Registrar componentes globalmente
app.component("pdf-confirmation-dialog", PDFConfirmationDialog);
app.component("abonar-compra-dialog", AbonarCompraDialog);

app.provide('$axios', axios); //Proporciona Axios para que este disponible en toda la aplicacion.

const token = localStorage.getItem('token');
if(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Manejador de errores global para evitar bucles infinitos
app.config.errorHandler = (err, vm, info) => {
  console.error('Error global capturado:', err);
  console.error('Componente:', vm);
  console.error('Info:', info);
  // No re-lanzar el error para evitar bucles
};

app.mount('#app');
