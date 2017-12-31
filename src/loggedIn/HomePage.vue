<template>
  <div>
    <div class="row">
      <div class="col-xs-2">
        <home-side-bar :unread-email-count="0"/>
      </div>
      <div class="col-xs-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import HomeSideBar from './homePage/HomeSideBar.vue'

function defaultHomeLocation (to, from, next) {
  if (to.name === 'home') {
    next({name: 'latestPosts'})
  } else {
    next()
  }
}

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
  beforeRouteEnter (to, from, next) {
    defaultHomeLocation(to, from, next)
  },
  beforeRouteUpdate (to, from, next) {
    defaultHomeLocation(to, from, next)
  }
}
</script>

<style>
</style>
