<template>
    <post-summaries-container 
      :posts="posts" 
      :favourite-post-ids="favouritePostIds"
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
      posts: 'loggedin/savedposts/getPosts',
      favouritePostIds: 'loggedin/favouritePostIds'})
  },
  methods: {
    updateFavouritePosts (post, shouldBeFavourited) {
      const storeAction = shouldBeFavourited ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + storeAction, post)
    }
  },
  watch: {
    favouritePostIds (newPostIds) {
      this.$store.dispatch('loggedin/savedposts/setPostIdsFilter', newPostIds)
    }
  },
  components: {
    'post-summaries-container': PostSummariesContainer
  }
}
</script>

<style>
</style>
