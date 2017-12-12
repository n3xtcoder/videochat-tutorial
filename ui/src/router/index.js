import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import LoginForm from '@/components/LoginForm';
import auth from '@/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: (to, from, next) => auth.assertAuthenticated()
        .then(next)
        .catch(() => { next({ path: '/login' }); }),
    },
    {
      path: '/login',
      name: 'LoginForm',
      component: LoginForm,
    },
  ],
});
