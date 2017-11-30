<template>
  <p v-if="isLoggedIn">You're logged in!</p>
  <app-not-logged-in v-else/>
</template>

<script>
import NotLoggedInApp from './notLoggedIn/App.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'app',
  components: {
    'app-not-logged-in': NotLoggedInApp
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
