import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import LoginForm from '@/components/LoginForm';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      name: 'LoginForm',
      component: LoginForm,
    },
  ],
});
