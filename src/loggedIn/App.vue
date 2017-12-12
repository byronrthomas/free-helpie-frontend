<template>
  <div class="container"  style="background-color: #fffafa">
    <div class="row"  style="background-color: #ffffff" >
      <div class="col-xs-12">
        <img src="../assets/FreeHelp2.png" alt="FreeHelp" height=100px>
        <div class="pull-right" style="margin-top: 45px">
          <a class="topbar-link lead">Home</a>
          <a class="topbar-link lead">Profile</a>
          <a class="topbar-link lead">Account</a>
          <a class="topbar-link lead">Invite</a>
          <a class="topbar-link lead">Sign out</a>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({'userProfileIsComplete': 'loggedin/userProfileIsComplete'})
  },
  watch: {
    userProfileIsComplete(val) {
      if (!val) {
        this.$router.push({name: 'profile'})
      } else {
        this.$router.push({name: 'home'})
      }
    }
  },
  created () {
    this.$store.dispatch('loggedin/initialise')
  }
}
</script>

<style>
  .topbar-link {
    color: #777;
    margin-left: 10px;
    

  }
</style>
