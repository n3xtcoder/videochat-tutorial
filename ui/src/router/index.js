import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import {store, login, logout, joinSession} from '@/store'

Vue.use(Router)

const ensureSessionJoined = (to, from, next) => {
  ensureLoggedIn(to, from, next)
  joinSession().then(function () {
    next()
  }).catch(function (err) {
    console.log(err)
  })
}

const skipIfLoggedIn = (to, from, next) => {
  if (store.getters.isLoggedIn) {
    return next('/')
  } else {
    return next()
  }
}

const ensureLoggedIn = (to, from, next) => {
  if (!store.getters.isLoggedIn) {
    return next('/login')
  } else {
    console.log('logged in!')
    return next()
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: HelloWorld,
      beforeEnter: ensureSessionJoined
    },
    { path: '/login',
      name: 'Login',
      component: Login,
      props: { login },
      beforeEnter: skipIfLoggedIn
    },
    { path: '/logout',
      name: 'Logout',
      beforeEnter: (to, from, next) => {
        logout()
        return ensureLoggedIn(to, from, next)
      }
    }
  ]
})
