<template>
  <div class="home">
    <b-jumbotron :header="title"
                 :lead="msg">
      <b-button size="lg" variant="primary" to="/video">Video</b-button>
    </b-jumbotron>
    <b-container>
      <b-row>
        <b-col lg="6">
          <h4>Powered by Vue</h4>
          <p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>

          <h4>Delivered by Schoen Digital</h4>
          <p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.</p>
        </b-col>

        <b-col lg="6">
          <h4>Fast is our DNA</h4>
          <p>Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.</p>

          <h4>Reliability in mind</h4>
          <p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.</p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      title: 'Videochat tutorial',
      msg: "A videochat using Vue.js, written for MindDoc's and N3XTCODER's workshop on Vue.js and React.",
    };
  },
};
</script>

<style>
</style>
