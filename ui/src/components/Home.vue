<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <el-button
      class="delete-token"
      type="success"
      @click="eraseToken"
    >
      Delete Token
    </el-button>
    <h3>Token</h3>
    <div class="token-box">
      <p>{{token}}</p>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import { TOKEN_NAME } from '@/environment';

export default {
  name: 'Home',
  mounted() {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      this.token = token;
    } else {
      router.push('/login'); // guarding against back button after erasing the token
    }
  },
  data() {
    return {
      msg: 'Schön Digital Labs & N3xtcoder - React VS Vue challenge!',
      token: '',
    };
  },

  methods: {
    eraseToken() {
      router.push('/login');
    },
  },
};
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

.home {
  text-align: center;
}

.token-box {
  display:inline-block;
  max-width: 400px;
  border: 2px solid #ccc;
  border-radius: 10px;
}

.token-box > p {
  max-width: 400px;
  padding: 10px;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}

.delete-token {
  width: 250px;
  text-align: center;
}
</style>
