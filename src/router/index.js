import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Agenda from '../views/Agenda.vue';
import Services from '../views/Services.vue';
import Empleado from '../views/Empleado.vue';
import Cliente from '../views/Cliente.vue';
import Sesion from '../views/Sesion.vue';

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
        path: "/servicios",
        name: "Services",
        component: Services,
    },
    {
        path: "/agenda",
        name: "Agenda",
        component: Agenda
    },
    {
        path: "/empleados",
        name: "Empleado",
        component: Empleado,
    },
    {
        path: "/clientes",
        name: "Cliente",
        component: Cliente,
    },
    {
        path: "/sesiones",
        name: "Sesion",
        component: Sesion,
    },
   
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;