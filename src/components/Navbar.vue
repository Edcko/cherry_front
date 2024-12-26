<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        router
        :to="item.link"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <transition name="fade">
    <v-app-bar app :elevation="6" rounded="" v-show="showNavbar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!--  
      <v-img
        src="../assets/logo_1.png"
        max-height="250"
        max-width="250"
        contain
        ></v-img>
        -->

      <v-spacer></v-spacer>

      <v-btn @click="toggleTheme" icon>
        <v-icon>{{ isDarkTheme ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>

      <v-btn v-if="isLogged" text @click="logout">Cerrar Sesión</v-btn>
    </v-app-bar>
  </transition>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';


export default {
  name: "Navbar_Component",

  props: ['user'],

  setup() {
    const drawer = ref(false);
    const showNavbar = ref(true);

    const store = useStore(); // utilizar useStore para acceder al store de Vuex
    const router = useRouter();
    const isLogged = computed(() => store.getters.isLoggedIn); // utilizar computed para acceder a una propiedad del store de Vuex
    console.log('isLogged:', isLogged.value);

     // Utilizamos el hook `useTheme` para manejar los temas
  const theme = useTheme();

// Verificar si el tema actual es oscuro
const isDarkTheme = computed(() => theme.global.name.value === 'dark');

// Función para alternar entre temas
const toggleTheme = () => {
  theme.global.name.value = isDarkTheme.value ? 'light' : 'dark';
};


    const items = computed(() => {
      if (isLogged.value) {
        return [
          {title: "Perfil", icon: "mdi-account", link: "/perfil"},
          { title: "Inicio", icon: "mdi-home", link: "/" },
          { title: "Agenda", icon: "mdi-calendar", link: "/agenda" },
          { title: "Valoraciones", icon: "mdi-star", link: "/valoraciones" },
          //{ title: "Nails" , icon: "mdi-nail", link: "/nails" },
          { title: "Clientes", icon: "mdi-account-group", link: "/clientes" },
          { title: "Empleados", icon: "mdi-account", link: "/empleados" },
          { title: "Cabinas", icon: "mdi-calendar-multiple", link: "/cabinas" },
          { title: "Paquetes", icon: "mdi-spa", link: "/Paquetes"},

        ];
      } else {
        return [
        { title: "Inicio", icon: "mdi-home", link: "/" },
        { title: "Iniciar Sesión", icon: "mdi-login", link: "/login" },
          
        ];
      }
    });

    const username = ref('');
    const password = ref('');

    const login = async () => {
      try{
        await store.dispatch('login', {email: username.value, password: password.value});
      }catch(error){
        console.log('Hubo un error durante el inicio de sesion', error);
      }
    };

    const logout = async () => {
      try{
        await store.dispatch('logout');
        router.push('/login');
      }catch(error){
        console.log('Hubo un error durante el cierre de sesion', error);
      }
    };

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        showNavbar.value = false;
      } else {
        showNavbar.value = true;
      }
    });

    return {
      drawer,
      showNavbar,
      items,
      isLogged,
      username,
      password,
      login,
      logout,
      isDarkTheme,
      toggleTheme,
    };
  },
};
</script>
