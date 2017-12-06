<template>
  <div>
    <div class="row">
      <div class="col-xs-2">
        <home-side-bar :unread-email-count="2"/>
      </div>
      <div class="col-xs-10">
        <latest-ads-page v-if="focusArea === 'latestAds'"/>
        <p v-else>You're home, but I don't know what to do!</p>
      </div>
    </div>
  </div>
</template>

<script>
import HomeSideBar from './homePage/HomeSideBar.vue'
import LatestAdsPage from './homePage/LatestAdsPage.vue'

export default {
  data () {
    return { focusArea: 'latestAds'}
  },
  components: {
    'home-side-bar': HomeSideBar,
    'latest-ads-page': LatestAdsPage
  }
}
</script>

<style>
</style>
