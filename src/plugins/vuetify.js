// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
//import { VCalendar } from 'vuetify/labs/VCalendar'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


export default createVuetify({
//  components:{
//    VCalendar
//  },
  components,
  directives,
  icons: {
    iconfont: 'mdiSvg',
  }
})
