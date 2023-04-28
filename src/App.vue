<template>
  <v-app>
    <navbar :user="state.user" />
    <v-main app class="main-background">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import store from '@/store';


export default {
  name: "App",

  components: {
    Navbar,
  },

  setup() {
    return {
      state: store.state,
    };
  },
};
</script>

<style>

  .main-background {
    background-color: #ffffff;
  }

</style>
