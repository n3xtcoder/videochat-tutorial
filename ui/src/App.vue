<template>
  <div id="app">
    <top />
    <router-view></router-view>
    <bottom />
  </div>
</template>

<script>
  import { Top, Bottom } from '@/components/layout';

  export default {
    name: 'app',
    components: { Top, Bottom },
  };
</script>

<style>
body {
  margin: 0;
}
#app {
  display: flex;
  height: 100vh;
  flex-flow: column;
  justify-content: space-between;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
