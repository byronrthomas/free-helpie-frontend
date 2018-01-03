<template>
  <post-detail-display
    :post="post",
    :posters-name="postersName"
  />  
</template>

<script>
import PostDetailDisplay from './loggedIn/homePage/PostDetailDisplay.vue'
import {INITIAL_POSTS} from './store/mockServer/initialPosts'

export default {
  data () {
    return {
      post: INITIAL_POSTS[0],
      postersName: 'John Doe'
    }
  },
  components: {
    'post-detail-display': PostDetailDisplay
  }
}
</script>

