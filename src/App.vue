<template>
  <div>
  <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  watch: {
    isLoggedIn(val) {
      if (val) {
        this.$router.push({name: 'loggedIn'})
      }
    }
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
