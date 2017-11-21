<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <span v-bind:title="message">
      Hover your mouse over me for a few seconds
      to see my dynamically bound title!
    </span>
    <p>{{ message }}</p>
    <button v-on:click="reverseMessage">Reverse Message</button>
    <p>{{ message }}</p>
    <input v-model="message">
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        message: 'You loaded this page on ' + new Date().toLocaleString(),
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods: {
      reverseMessage: function () {
        this.message = this.message.split('').reverse().join('')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
