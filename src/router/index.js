import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Perfil from '../views/Perfil.vue';
import Agenda from '../views/Agenda.vue';
import Nails from '../views/Nails.vue';
import Valoracion from '../views/Valoracion.vue';
import Cabina from '../views/Cabina.vue';
import Paquete from '../views/Paquete.vue';
import Empleado from '../views/Empleado.vue';
import Cliente from '../views/Cliente.vue';
import Sesion from '../views/Sesion.vue';
import NotFound from '../views/NotFound.vue';
import store from '../store';
import { computed } from 'vue';

const isLoggedIn = computed(() => store.getters.isLoggedIn);

function requireRole(roles) {
    return (to, from, next) => {
        if (!isLoggedIn.value) {
            next({ name: 'NotFound' });
        } else {
            const tipoEmpleado = store.getters.tipoEmpleado;
            if (roles.includes(tipoEmpleado)) {
                next();
            } else {
                next({ name: 'NotFound' });
            }
        }
    }
}

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { requiresAuth: false }, // Ruta pública
    },

    {
        path: "/perfil",
        name: "Perfil",
        component: Perfil,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
    },

    {
        path: "/paquetes",
        name: "Paquete",
        component: Paquete,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador','Gerente', 'Manager', 'Recepcionista', 'Recepción', 'Valoradora']),
    },
    {
        path: '/agenda',
        name: 'Agenda',
        component: Agenda,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador','Gerente', 'Manager', 'Recepcionista', 'Recepción', 'Valoradora', 'Terapeuta']),
      },
      {
        path: '/nails',
        name: 'Nails',
        component: Nails,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador','Gerente', 'Manager', 'Recepcionista', 'Recepción', 'Valoradora']),
      },
      {
        path: '/evaluaciones',
        name: 'Valoracion',
        component: Valoracion,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador','Gerente']),
      },
    {
        path: "/empleados",
        name: "Empleado",
        component: Empleado,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador']),
    },
    {
        path: "/cabinas",
        name: "Cabina",
        component: Cabina,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador']),
    },
    {
        path: "/clientes",
        name: "Cliente",
        component: Cliente,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador', 'Manager', 'Gerente']),
    },
    {
        path: "/sesiones",
        name: "Sesion",
        component: Sesion,
        meta: { requiresAuth: true }, // Indicar que requiere autenticación
        beforeEnter: requireRole(['Desarrollador', 'Administrador','Gerente']),
    },
/*    {
        path: "/perteneceA",
        name: "PerteneceA",
        component: PerteneceA,
        beforeEnter: requireRole(['Administrador','Gerente']),
    },
    {
        path: "/trabajaEn",
        name: "TrabajaEn",
        component: TrabajaEn,
        beforeEnter: requireRole(['Administrador','Gerente']),
    },
*/
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Implementar la guardia global
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isLoggedIn; // Verificar autenticación desde Vuex
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    // Si la ruta requiere autenticación y no está autenticado, redirigir a login
    if (requiresAuth && !isAuthenticated) {
      next('/login'); // Redirigir a login
    } else if (to.path === '/login' && isAuthenticated) {
      // Si intenta ir a login y ya está autenticado, redirigir a Home
      next('/');
    } else {
      next(); // Continuar a la ruta solicitada
    }
    });  

export default router;