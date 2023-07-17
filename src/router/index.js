import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
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
        path: "/paquetes",
        name: "Paquete",
        component: Paquete,
        beforeEnter: (to, from, next) => {
            if(!isLoggedIn.value) {
                next({name: 'NotFound'}); // si el usuario no esta logueado
            } else {
                next(); // permite el acceso a la ruta
            }
        },
    },
    {
        path: "/agenda",
        name: "Agenda",
        component: Agenda,
        beforeEnter: (to, from, next) => {
            if(!isLoggedIn.value) {
                next({name: 'NotFound'}); // si el usuario no esta logueado
            } else {
                next(); // permite el acceso a la ruta
            }
        },
    },
    {
        path: "/empleados",
        name: "Empleado",
        component: Empleado,
        beforeEnter: (to, from, next) => {
            if(!isLoggedIn.value) {
                next({name: 'NotFound'}); // si el usuario no esta logueado
            } else {
                next(); // permite el acceso a la ruta
            }

        },
    },
    {
        path: "/cabinas",
        name: "Cabina",
        component: Cabina,
        beforeEnter: (to, from, next) => {
            if(!isLoggedIn.value) {
                next({name: 'NotFound'}); // si el usuario no esta logueado
            } else {
                next(); // permite el acceso a la ruta
            }
        },
    },
    {
        path: "/clientes",
        name: "Cliente",
        component: Cliente,
        beforeEnter: (to, from, next) => {
            if(!isLoggedIn.value) {
                next({name: 'NotFound'}); // si el usuario no esta logueado
            } else {
                next(); // permite el acceso a la ruta
            }
        },
    },
    {
        path: "/sesiones",
        name: "Sesion",
        component: Sesion,
        beforeEnter: (to, from, next) => {
            if(!isLoggedIn.value) {
                next({name: 'NotFound'}); // si el usuario no esta logueado
            } else {
                next(); // permite el acceso a la ruta
            }
        },
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