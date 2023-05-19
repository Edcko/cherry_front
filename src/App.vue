<template>
  <v-app>

    <navbar :user="state.user" />
  
    <v-main app class="main-background">
      <router-view/>
    </v-main>

    <global-alert
        :show="showGlobalAlert"
        :message="globalAlertMessage"
        :type="globalAlertType"
      />
    <test-component></test-component>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import store from '@/store';
import useGlobalAlert from "./composables/useGlobalAlert";
import GlobalAlert from "./components/GlobalAlert.vue";
import { getCurrentInstance } from 'vue';
import TestComponent from "./components/TestComponent.vue";

export default {
  name: "App",

  components: {
    Navbar,
    GlobalAlert,
    TestComponent
  },

  setup() {
    const {
      showGlobalAlert,
      globalAlertMessage,
      globalAlertType,
      showAlert,
    } = useGlobalAlert();

    // Exponer la función showAlert para que otros componentes puedan utilizarla
    const app = getCurrentInstance();
    app.appContext.config.globalProperties.$showAlert = showAlert;

    return {
      state: store.state,
      showGlobalAlert,
      globalAlertMessage,
      globalAlertType,
    };
  },
};
</script>

<style>
  .main-background {
    background-color: #ffffff;
  }
</style>
