import Vue from 'vue'
import VueRouter, { RouteConfig, NavigationGuard } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import store from '../store/index';

Vue.use(VueRouter)

const requireAuth: NavigationGuard<Vue> = (to, from, next) => {
  if (!store.getters.authenticated) {
    next({
      path: '/login',
      query: { lastPage: to.fullPath }
    })
  } else {
    next()
  }
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth,
  },
  { path: '/login', component: Login },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
