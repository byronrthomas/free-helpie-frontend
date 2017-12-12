<template>
  <div>
    <div class="row">
      <div class="col-xs-2">
        <home-side-bar :unread-email-count="2" @gotoLatestAds="focusArea = 'latestAds'"/>
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
  data () {
    return { focusArea: 'latestAds', currentAd: null }
  },
  components: {
    'home-side-bar': HomeSideBar,
  },
  methods: {
    viewPost (post) {
      this.focusArea = 'adDetail'
      this.currentAd = post
    },
    updateFavouritePosts (post, shouldFavourite) {
      const action = shouldFavourite ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + action, post)
    },
  },
  created () {
    this.$router.push({name: 'latestPosts'})
  }
}
</script>

<style>
</style>
