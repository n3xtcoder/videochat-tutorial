<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="8" offset-md="2">
          <h1>VideoChat Tutorial</h1>
          <h2>Login</h2>
          <b-form @submit.prevent="login">
            <b-alert variant="danger" dismissible :show="error" @dismissed="error = null">
              {{ error }}
            </b-alert>
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
      error: null,  // b-alert show won't work well with empty string
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
