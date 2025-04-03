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
    <v-app-bar app :elevation="6" rounded v-show="showNavbar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      
      <!-- Título dinámico -->
      <v-toolbar-title>{{ navbarTitle }}</v-toolbar-title>
      
      <v-spacer>

<!--  
<v-img
  src="../assets/logo_1.png"
  max-height="250"
  max-width="250"
  contain
  ></v-img>
  -->

</v-spacer>
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
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from 'vuetify';

export default {
  name: "Navbar_Component",
  props: ['user'],
  setup() {
    const drawer = ref(false);
    const showNavbar = ref(true);
    const store = useStore();
    const router = useRouter();
    const route = useRoute(); // Obtenemos la ruta actual
    const isLogged = computed(() => store.getters.isLoggedIn);

    // Manejo de tema con Vuetify
    const theme = useTheme();
    const isDarkTheme = computed(() => theme.global.name.value === 'dark');
    const toggleTheme = () => {
      theme.global.name.value = isDarkTheme.value ? 'light' : 'dark';
    };

    // Definición de items de navegación basados en el estado de login
    const items = computed(() => {
      if (isLogged.value) {
        return [
          { title: "Perfil", icon: "mdi-account", link: "/perfil" },
          { title: "Inicio", icon: "mdi-home", link: "/" },
          { title: "Agenda", icon: "mdi-calendar", link: "/agenda" },
          { title: "Evaluaciones", icon: "mdi-star", link: "/evaluaciones" },
          { title: "Clientes", icon: "mdi-account-group", link: "/clientes" },
          { title: "Empleados", icon: "mdi-account", link: "/empleados" },
          { title: "Cabinas", icon: "mdi-calendar-multiple", link: "/cabinas" },
          { title: "Paquetes", icon: "mdi-spa", link: "/paquetes" },
        ];
      } else {
        return [
          { title: "Inicio", icon: "mdi-home", link: "/" },
          { title: "Iniciar Sesión", icon: "mdi-login", link: "/login" },
        ];
      }
    });

    // Computed que devuelve el título del navbar según la ruta actual
    const navbarTitle = computed(() => {
      // Si se definió en la meta de la ruta, se utiliza ese título
      if (route.meta && route.meta.navbarTitle) {
        return route.meta.navbarTitle;
      }
      // Si no se definió, se puede implementar una lógica personalizada:
      switch(route.path) {
        case '/agenda':
          return 'Portal de Agenda';
        case '/clientes':
          return 'Portal de Clientes';
        case '/empleados':
          return 'Portal de Empleados';
        default:
          return 'Mi Aplicación';
      }
    });

    // Autenticación
    const username = ref('');
    const password = ref('');

    const login = async () => {
      try {
        await store.dispatch('login', { email: username.value, password: password.value });
      } catch (error) {
        console.log('Hubo un error durante el inicio de sesión', error);
      }
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        router.push('/login');
      } catch (error) {
        console.log('Hubo un error durante el cierre de sesión', error);
      }
    };

    // Mostrar u ocultar el navbar según el scroll
    window.addEventListener("scroll", () => {
      showNavbar.value = window.scrollY <= 100;
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
      navbarTitle, // Propiedad computada para el título
    };
  },
};
</script>