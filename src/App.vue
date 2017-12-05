<template>
  <app-logged-in v-if="isLoggedIn"/>
  <app-not-logged-in v-else/>
</template>

<script>
import NotLoggedInApp from './notLoggedIn/App.vue'
import LoggedInApp from './loggedIn/App.vue'
import {mapGetters} from 'vuex'
export default {
  name: 'app',
  components: {
    'app-not-logged-in': NotLoggedInApp,
    'app-logged-in': LoggedInApp
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
