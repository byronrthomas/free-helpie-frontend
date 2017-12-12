<template>
  <div class="post-summary-container">
    <slot/>
    <div class="row">
      <div class="col-xs-12">
        <post-summary-item 
          v-for="post in posts" 
          :post="post" 
          :key="post.id"
          :is-saved="isSaved(post)"
          @viewPost="$emit('viewPost', post)"
          @savePost="$emit('updateFavouritePosts', post, !isSaved(post))" />
      </div>
    </div>
  </div>
</template>

<script>
import PostSummaryItem from './PostSummaryItem.vue'

export default {
  props: {
    posts: Array,
    favouritePostIds: Array
  },
  methods: {
    isSaved (post) {
      return this.favouritePostIds.includes(post.id)
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
