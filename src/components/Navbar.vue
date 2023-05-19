<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list dense>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
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

      <v-toolbar-title>TANYA DE ICAZA</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text>Cerrar Sesión</v-btn>
    </v-app-bar>
  </transition>
</template>

<script>
export default {
  name: "Navbar_Component",

  data: () => ({
    drawer: false,
    showNavbar: true,
    items: [
      { title: "Inicio", icon: "mdi-home", link: "/" },
      { title: "Agenda", icon: "mdi-calendar", link: "/agenda" },
      { title: "Iniciar Sesión", icon: "mdi-login", link: "/login" },
      { title: "Clientes", icon: "mdi-account-group", link: "/clientes" },
      { title: "Empleado", icon: "mdi-account", link: "/empleados" },
      { title: "Sesiones", icon: "mdi-calendar-multiple", link: "/sesiones" },
      { title: "Servicios", icon: "mdi-hammer-screwdriver", link: "/servicios"},
    ],
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    handleScroll() {
      if (window.scrollY > 100) {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    },
  },
};
</script>

<style scoped>
.v-app-bar {
  background-color: transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-logo {
  font-size: 24px;
  font-weight: bold;
}

.nav-btn {
  margin-left: 1rem;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
