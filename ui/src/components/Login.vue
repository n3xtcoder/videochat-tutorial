<template>
  <form v-on:submit.prevent="onLogin">
    <div v-if="error">{{error}}</div>
    <label>Username</label><input type="text" v-model.trim="username"/>
    <label>Password</label><input type="password" v-model.trim="password"/>
    <button type="submit" v-bind:disabled="isLoginDisabled()">Login</button>
  </form>
</template>

<script>
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
        this.login(this.username, this.password).then(() => {
          console.log('logged in!')
          return this.$router.push('/')
        }).catch((err) => {
          this.error = `${err}`
        })
      }
    },
    props: ['login']
  }
</script>
