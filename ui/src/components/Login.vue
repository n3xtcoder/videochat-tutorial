<template>
  <form v-on:submit.prevent="onLogin">
    <div v-if="error">{{error}}</div>
    <label>Username</label><input type="text" v-model.trim="username"/>
    <label>Password</label><input type="password" v-model.trim="password"/>
    <button type="submit" v-bind:disabled="isLoginDisabled()">Login</button>
  </form>
</template>

<script>
  import { login } from '../utils/client'

  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {
      isLoginDisabled: function () {
        return !(this.username && this.password)
      },
      onLogin: function () {
        login(this.username, this.password)
      }
    }
  }
</script>
