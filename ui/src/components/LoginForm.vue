<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="8" offset-md="2">
          <h1>VideoChat Tutorial</h1>
          <h2>Login</h2>
          <b-form @submit.prevent="login">
            <b-form-input
              v-model="username"
              type="text"
              placeholder="Your username"
              label="Username"
              required />
            <b-form-input
              v-model="password"
              type="password"
              placeholder="Your password"
              label="Password"
              required />
            <b-button type="submit" variant="primary">Login</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
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
form > * {
  margin-top: 18px;
  margin-bottom: 18px;
}
.container {
  text-align: center;
}
</style>
