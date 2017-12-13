<template>
  <div>
    <b-container>
      <b-row>
        <b-col md="8" offset-md="2">
          <h1>VideoChat Tutorial</h1>
          <h2>Login</h2>
          <b-form @submit.prevent="login">
            <b-alert variant="danger" dismissible :show="error !== ''" @dismissed="error = ''">
              {{ error | titleCase }}
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
import auth from '@/auth';
import router from '@/router';

const titleCase = text => text.replace(
  /\w*/g,
  match => (match.charAt(0).toUpperCase() + match.substr(1).toLowerCase()),
);

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
      if (this.username && this.password) {
        return auth.authenticate(this.username, this.password)
          .then(() => { router.push('/'); })
          .catch((error) => { this.error = error; });
      }
      return null;
    },
  },
  filters: {
    titleCase,
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
