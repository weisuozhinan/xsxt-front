import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Register from "@/views/Register";
import Home from "@/views/Home";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        hidden: true
    },
    {
        path: '/home',
        name: '导航',
        component: Home,

    }

]

const router = new VueRouter({
    routes
})

export default router
