import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Video from '@/components/Video';

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
      path: '/video',
      name: 'Video',
      component: Video,
    },
  ],
});
