import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import {auth} from '@/utils/client'

Vue.use(Vuex)
Vue.use(Router)

const store = new Vuex.Store({
  state: {
    user: {
      jwt: ''
    }
  },
  mutations: {
    addJwt (state, jwt) {
      console.log(jwt)
      state.user.jwt = jwt
    }
  }
})

function login (username, password) {
  auth(username, password).then(function (jwt) {
    store.commit('addJwt', jwt)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    { path: '/login',
      name: 'Login',
      component: Login,
      props: { login }
    }
  ]
})
