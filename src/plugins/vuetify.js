// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
//import { VCalendar } from 'vuetify/labs/VCalendar'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


export default createVuetify({
  theme: {
    defaultTheme: 'light', // Establece el tema por defecto
    themes: {
      light: {
        dark: false, // Asegura que este tema es claro
        colors: {
          background: '#FFFFFF',
          primary: '#1976D2',
          secondary: '#424242',
        },
      },
      dark: {
        dark: true, // Este tema es oscuro
        colors: {
          background: '#121212',
          primary: '#BB86FC',
          secondary: '#03DAC6',
        },
      },
    },
  },
  components,
  directives,
  icons: {
    iconfont: 'mdiSvg',
  }
})
