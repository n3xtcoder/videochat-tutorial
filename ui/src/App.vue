<template>
  <div class="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-brand href="#">MindDoc</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="/">Home</b-nav-item>
        <b-nav-item href="/video">Video</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="pull-right">
        <b-nav-item v-if="loggedIn" href="/logout">Log out!</b-nav-item>
        <b-nav-item v-else href="/login">Login</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>
import auth from '@/auth';

export default {
  name: 'app',
  data() {
    return {
      loggedIn: auth.jwt.get() !== null,
    };
  },
  watch: {
    $route() {
      // We don't validate against the server, we just check if it's there.
      this.loggedIn = auth.jwt.get() !== null;
    },
  },
};
</script>

<style>
.pull-right {
  margin-left: auto!important;
}
</style>
