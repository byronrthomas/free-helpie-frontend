<template>
  <div>
    <div class="row">
      <div class="col-xs-6 col-xs-offset-6">
        <button class="btn btn-primary" @click="currentFilter = 'Unfiltered'">Unfiltered</button>
        <button class="btn btn-primary" @click="currentFilter = 'MySkills'">My skills</button>
        <button class="btn btn-primary" @click="currentFilter = 'MyLocation'">My location</button>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <ad-summary-item v-for="post in filteredPosts" :ad="post" :key="post.id"/>
      </div>
    </div>
  </div>
</template>

<script>
import { INITIAL_POSTS } from './initialPosts' 
import AdSummaryItem from './AdSummaryItem.vue'

export default {
  data() {
    return {currentFilter: 'Unfiltered', posts: INITIAL_POSTS}
  },
  computed: {
    filteredPosts() {
      console.log("Attempting to filter result")
      const result = (!this.currentFilter || this.currentFilter === 'Unfiltered')
        ? this.posts
        : (this.currentFilter === "MySkills"
            ? this.posts.filter(post => post.skills.includes('Executive coaching'))
            : this.posts.filter(post => post.remote || post.location === 'North-west London'))
      console.log("Filtered to:")
      console.log(result)
      return result;
    }
  },
  components: {
    'ad-summary-item': AdSummaryItem
  }
}
</script>

<style>
</style>
