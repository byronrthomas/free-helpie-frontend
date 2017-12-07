<template>
  <div class="latest-ad-container">
    <div class="row" style="margin-bottom: 10px">
      <div class="col-xs-12">
        <span>Filter results</span>
        <button 
          class="btn"
          @click="filteringBySkills = !filteringBySkills"
          :class="{'btn-primary': filteringBySkills}">
          My skills
        </button>
        <button 
          class="btn" 
          @click="filteringByLocation = !filteringByLocation"
          :class="{'btn-primary': filteringByLocation}">
          My location
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <ad-summary-item 
          v-for="post in filteredPosts" 
          :ad="post" 
          :key="post.id"
          :is-saved="post.postedBy === 'John Doe'"
          @viewPost="$emit('viewPost', post)"
          @savePost="$emit('savePost', post)" />
      </div>
    </div>
  </div>
</template>

<script>
import { INITIAL_POSTS } from './initialPosts' 
import AdSummaryItem from './AdSummaryItem.vue'

export default {
  data() {
    return {
      filteringBySkills: false,
      filteringByLocation: false,
      posts: INITIAL_POSTS}
  },
  computed: {
    filteredPosts() {
      console.log("Attempting to filter result")
      let result = this.posts
      result = this.filteringBySkills
        ? result.filter(post => post.skills.includes('Executive coaching'))
        : result
      result = this.filteringByLocation
        ? result.filter(post => post.remote || post.location === 'North-west London')
        : result
      console.log("Filtered to:")
      console.log(result)
      return result;
    },
    skillsFilterActive() {
      return this.currentFilter === "MySkills" || this.currentFilter === "Both"
    }
  },
  components: {
    'ad-summary-item': AdSummaryItem
  }
}
</script>

<style>
  .latest-ad-container {
    border-style: solid;
    border-width: 1px 1px 1px 1px; 
    border-color: #ddd; 
    padding: 10px;
    margin-top: 10px;
  }
</style>
