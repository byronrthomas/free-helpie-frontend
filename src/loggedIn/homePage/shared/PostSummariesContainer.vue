<template>
  <div class="post-summary-container">
    <slot/>
    <div class="row">
      <div class="col-xs-12">
        <post-summary-item 
          v-for="(post, postIdKey) in posts" 
          :post="post" 
          :user-display="getDisplayName(post.postedBy)"
          :key="postIdKey"
          :is-saved="isSaved(postId(postIdKey))"
          @viewPost="viewPost(postId(postIdKey))"
          @savePost="$emit('updateFavouritePosts', postId(postIdKey), !isSaved(postIdKey))"
          @viewUser="viewUser(post.postedBy)" />
      </div>
    </div>
  </div>
</template>

<script>
import PostSummaryItem from './PostSummaryItem.vue'

export default {
  props: {
    posts: Object,
    favouritePostIds: Array,
    profileInfo: {
      type: Object,
      required: true
    },
    loggedInUserId: Number
  },
  methods: {
    postId (postIdKey) {
      return parseInt(postIdKey)
    },
    isSaved (postIdKey) {
      return this.favouritePostIds.includes(this.postId(postIdKey))
    },
    viewPost (postId) {
      this.$router.push({name: 'postDetail', params: {postId}})
    },
    viewUser (userId) {
      this.$router.push({name: 'userDetail', params: {userId}})
    },
    getDisplayName (userId) {
      const userInfo = this.profileInfo[userId] || {name: '[unknown]'}
      return userId === this.loggedInUserId
        ? `You (${userInfo.name})`
        : userInfo.name
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
