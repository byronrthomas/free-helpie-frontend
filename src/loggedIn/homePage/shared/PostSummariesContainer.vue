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
          @viewPost="viewPost(post, postIdKey)"
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
    viewPost (post, postIdKey) {
      const postId = this.postId(postIdKey)
      if (this.isCurrentUser(post.postedBy)) {
        this.$router.push({name: 'editPost', params: {postId}})
      } else {
        this.$router.push({name: 'postDetail', params: {postId}})
      }
    },
    viewUser (userId) {
      if (this.isCurrentUser(userId)) {
        this.$router.push({name: 'profile'})
      } else {
        this.$router.push({name: 'userDetail', params: {userId}})
      }
    },
    isCurrentUser (userId) {
      // DRY - this kind of stuff seems to be all over the place
      return this.loggedInUserId === userId
    },
    getDisplayName (userId) {
      // DRY - this kind of stuff seems to be all over the place
      const userInfo = this.profileInfo[userId] || {name: '[unknown]'}
      return this.isCurrentUser(userId)
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
