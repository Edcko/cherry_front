<template>
  <v-app>

    <navbar v-if="$route.name !== 'Login'" :user="state.user" />
  
    <v-main app>
      <router-view/>
    </v-main>

    <global-alert
        :show="showGlobalAlert"
        :message="globalAlertMessage"
        :type="globalAlertType"
      />
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
//import store from '@/store';
import {useStore} from 'vuex';
import useGlobalAlert from "./composables/useGlobalAlert";
import GlobalAlert from "./components/GlobalAlert.vue";
import { getCurrentInstance } from 'vue';
import { onMounted } from 'vue';
//import TestComponent from "./components/TestComponent.vue";

export default {
  name: "App",

  components: {
    Navbar,
    GlobalAlert,
  //  TestComponent
  },

  setup() {
    const {
      showGlobalAlert,
      globalAlertMessage,
      globalAlertType,
      showAlert,
    } = useGlobalAlert();

    const store = useStore(); // utilizar useStore para acceder al store de Vuex

    // Exponer la función showAlert para que otros componentes puedan utilizarla
    const app = getCurrentInstance();
    app.appContext.config.globalProperties.$showAlert = showAlert;

    onMounted(() => {
      store.dispatch('checkAuthentication');
    });

    return {
      state: store.state,
      showGlobalAlert,
      globalAlertMessage,
      globalAlertType,
    };
  },
};
</script>
