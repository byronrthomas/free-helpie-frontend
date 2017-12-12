<template>
  <div>
    <div class="row">
      <div class="col-xs-2">
        <home-side-bar :unread-email-count="2"/>
      </div>
      <div class="col-xs-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import HomeSideBar from './homePage/HomeSideBar.vue'

export default {
  components: {
    'home-side-bar': HomeSideBar
  },
  methods: {
    updateFavouritePosts (post, shouldFavourite) {
      const action = shouldFavourite ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + action, post)
    }
  },
  created () {
    this.$router.push({name: 'latestPosts'})
  }
}
</script>

<style>
</style>
