<template>
  <div>
    <div class="row">
      <div class="col-xs-2">
        <home-side-bar :unread-email-count="2" @gotoLatestAds="focusArea = 'latestAds'"/>
      </div>
      <div class="col-xs-10">
        <latest-ads-page 
          v-if="focusArea === 'latestAds'" 
          @viewPost="viewPost"
          @updateFavouritePosts="updateFavouritePosts"/>
        <ad-detail-page v-else-if="focusArea === 'adDetail'" :ad="currentAd"/>
        <p v-else>You're home, but I don't know what to do!</p>
      </div>
    </div>
  </div>
</template>

<script>
import HomeSideBar from './homePage/HomeSideBar.vue'
import LatestAdsPage from './homePage/LatestAdsPage.vue'
import AdDetailPage from './homePage/AdDetailPage.vue'

export default {
  data () {
    return { focusArea: 'latestAds', currentAd: null }
  },
  components: {
    'home-side-bar': HomeSideBar,
    'latest-ads-page': LatestAdsPage,
    'ad-detail-page': AdDetailPage
  },
  methods: {
    viewPost (post) {
      this.focusArea = 'adDetail'
      this.currentAd = post
    },
    updateFavouritePosts (post, shouldFavourite) {
      const action = shouldFavourite ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + action, post)
    }
  }
}
</script>

<style>
</style>
