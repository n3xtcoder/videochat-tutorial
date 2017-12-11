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
      console.log(`TODO: POST request with username: ${this.username} and password: ${this.password}`);
    },
  },
};
</script>

<style scoped>
label {
  display: block;
}
</style>
