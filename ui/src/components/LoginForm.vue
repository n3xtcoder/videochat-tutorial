<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="8" offset-md="2">
          <h1>VideoChat Tutorial</h1>
          <h2>Login</h2>
          <b-form @submit.prevent="login">
            <b-alert variant="danger" dismissible :show="error !== ''" @dismissed="error = ''">
              {{ error }}
            </b-alert>
            <b-form-input
              v-model="username"
              name="username"
              type="text"
              placeholder="Your username"
              label="Username"
              required />
            <b-form-input
              v-model="password"
              name="password"
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
import router from '@/router';

const getErrorMessage = (response) => {
  const msg = (response && response.data && response.data.message) || 'Unknown Error';
  const status = response.status;
  return `${msg} (${status})`;
};

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    login() {
      axios.post('/api/user', {
        username: this.username,
        password: this.password,
      }).then((response) => {
        localStorage.setItem('jwt', response.data.jwt);
        router.push('/');
      }).catch((error) => {
        this.error = getErrorMessage(error.response);
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
