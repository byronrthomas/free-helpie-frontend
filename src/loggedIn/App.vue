<template>
  <div class="container"  style="background-color: #fffafa">
    <div class="row"  style="background-color: #ffffff" >
      <div class="col-xs-12">
        <img src="../assets/FreeHelp2.png" alt="FreeHelp" height=100px>
        <div class="pull-right" style="margin-top: 45px">
          <router-link class="topbar-link lead" :to="{name: 'home'}">Home</router-link>
          <router-link class="topbar-link lead" :to="{name: 'profile'}">Profile</router-link>
          <router-link class="topbar-link lead" :to="{name: 'account'}">Account</router-link>
          <a class="topbar-link lead" @click="alertNotImplemented">Invite</a>
          <a class="topbar-link lead" @click="signOut">Sign out</a>
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
  methods: {
    alertNotImplemented () {
      alert('Sorry, this function is not implemented yet.')
    },
    signOut () {
      this.$store.dispatch('loggedin/logout')
      this.$store.dispatch('logout')
      this.$router.push({name: 'notLoggedIn'})
    }
  },
  watch: {
    userProfileIsComplete (val) {
      if (!val) {
        this.$router.push({name: 'profile'})
      } else {
        this.$router.push({name: 'home'})
      }
    }
  },
  created () {
    if (!this.$store.getters.isLoggedIn) {
      // NOTE: this could potentially be implemented as a beforeEnterRoute
      // method - however, I found this tricky as I wasn't sure what to return
      // from the callback of next() - returning a Location didn't seem to work
      console.log("Redirecting to not logged in page as not yet auth'd")
      this.$router.push({name: 'notLoggedIn'})
    } else {
      this.$store.dispatch('loggedin/initialise')
    }
  }
}
</script>

<style>
  .topbar-link {
    color: #777;
    margin-left: 10px;
    

  }
</style>
