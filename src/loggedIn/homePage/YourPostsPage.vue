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
      posts: 'loggedin/yourposts/getPosts',
      favouritePostIds: 'loggedin/favouritePostIds',
      username: 'username'})
  },
  methods: {
    updateFavouritePosts (post, shouldBeFavourited) {
      const storeAction = shouldBeFavourited ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + storeAction, post)
    }
  },
  created () {
    this.$store.dispatch('loggedin/yourposts/setPostedByFilter', [this.username])
  },
  components: {
    'post-summaries-container': PostSummariesContainer
  }
}
</script>

<style>
</style>
