import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Perfil from '../views/Perfil.vue';
import Agenda from '../views/Agenda.vue';
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
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },

    {
        path: "/perfil",
        name: "Perfil",
        component: Perfil,
    },

    {
        path: "/paquetes",
        name: "Paquete",
        component: Paquete,
        beforeEnter: requireRole(['Administrador','Gerente']),
    },
    {
        path: '/agenda',
        name: 'Agenda',
        component: Agenda,
        beforeEnter: requireRole(['Administrador','Gerente']),
      },
    {
        path: "/empleados",
        name: "Empleado",
        component: Empleado,
        beforeEnter: requireRole(['Administrador','Gerente']),
    },
    {
        path: "/cabinas",
        name: "Cabina",
        component: Cabina,
        beforeEnter: requireRole(['Administrador','Gerente']),
    },
    {
        path: "/clientes",
        name: "Cliente",
        component: Cliente,
        beforeEnter: requireRole(['Administrador','Gerente', 'Recepcionista', 'Recepción']),
    },
    {
        path: "/sesiones",
        name: "Sesion",
        component: Sesion,
        beforeEnter: requireRole(['Administrador','Gerente']),
    },
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

export default router;