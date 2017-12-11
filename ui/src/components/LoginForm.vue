<template>
  <div>
    <h1>VideoChat Tutorial</h1>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label>
        Username
        <input v-model="username" type="text"  placeholder="Your username">
      </label>
      <label>
        Password
        <input v-model="password" type="password"  placeholder="Your password">
      </label>
      <button type="submit">
        Login
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      axios.post('/api/user', {
        username: this.username,
        password: this.password,
      }).then((data) => {
        console.log(data);
      }).catch((error) => {
        const { response } = error;
        console.error(response);
      });
    },
  },
};
</script>

<style scoped>
label {
  display: block;
}
</style>
