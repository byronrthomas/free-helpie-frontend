<template>
    <post-summaries-container 
      :posts="posts" 
      :favourite-post-ids="favouritePostIds"
      :profile-info="profileInfo"
      @viewPost="$emit('viewPost', $event)"
      @updateFavouritePosts="updateFavouritePosts">
    </post-summaries-container>
</template>

<script>
import { mapGetters } from 'vuex'
import PostSummariesContainer from './shared/PostSummariesContainer.vue'

export default {
  computed: {
    ...mapGetters({
      posts: 'loggedin/yourposts/getPosts',
      profileInfo: 'loggedin/yourposts/profileInfo',
      favouritePostIds: 'loggedin/favouritePostIds',
      userId: 'loggedin/userId'})
  },
  methods: {
    updateFavouritePosts (post, shouldBeFavourited) {
      const storeAction = shouldBeFavourited ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + storeAction, post)
    }
  },
  created () {
    this.$store.dispatch('loggedin/yourposts/setPostedByFilter', [this.userId])
  },
  components: {
    'post-summaries-container': PostSummariesContainer
  }
}
</script>

<style>
</style>
