import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Login from '@/components/Login';
import { checkAuth } from './_auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: checkAuth,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});
