<template>
  <div class="post-summary-container">
    <slot/>
    <div class="row">
      <div class="col-xs-12">
        <post-summary-item 
          v-for="(post, postId) in posts" 
          :post="post" 
          :key="postId"
          :is-saved="isSaved(postId)"
          @viewPost="viewPost(postId)"
          @savePost="$emit('updateFavouritePosts', postId, !isSaved(postId))" />
      </div>
    </div>
  </div>
</template>

<script>
import PostSummaryItem from './PostSummaryItem.vue'

export default {
  props: {
    posts: Object,
    favouritePostIds: Array
  },
  methods: {
    isSaved (postId) {
      return this.favouritePostIds.includes(postId)
    },
    viewPost (postId) {
      this.$router.push({name: 'postDetail', params: {postId}})
    }
  },
  components: {
    'post-summary-item': PostSummaryItem
  }
}
</script>

<style>
  .post-summary-container {
    border-style: solid;
    border-width: 1px 1px 1px 1px; 
    border-color: #ddd; 
    padding: 10px;
    margin-top: 10px;
  }
</style>
