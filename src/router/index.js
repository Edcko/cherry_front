import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Agenda from '../views/Agenda.vue';
import Services from '../views/Services.vue';

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
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;