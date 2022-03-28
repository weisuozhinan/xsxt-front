import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Register from "@/views/Register";
import Test1 from "@/views/Test1";
import Home from "@/views/Home";
import Test2 from "@/views/Test2";

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
        children: [
            {
                path: '/test1',
                name: '选项1',
                component: Test1
            },
            {
                path: '/test2',
                name: '选项2',
                component: Test2
            }
        ]
    }

]

const router = new VueRouter({
    routes
})

export default router
