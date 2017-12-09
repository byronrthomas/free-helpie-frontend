<template>
  <div class="latest-ad-container">
    <div class="row" style="margin-bottom: 10px">
      <div class="col-xs-12">
        <span>Filter results</span>
        <button 
          class="btn"
          @click="toggleSkillsFilter"
          :class="{'btn-primary': filteringBySkills}">
          My skills
        </button>
        <button 
          class="btn" 
          @click="toggleInterestsFilter"
          :class="{'btn-primary': filteringByInterests}">
          My interests
        </button>
        <button 
          class="btn" 
          @click="toggleLocationsFilter"
          :class="{'btn-primary': filteringByLocations}">
          My location
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <ad-summary-item 
          v-for="post in decoratedPosts" 
          :ad="post.content" 
          :key="post.content.id"
          :is-saved="post.isSaved"
          @viewPost="$emit('viewPost', post.content)"
          @savePost="$emit('updateFavouritePosts', post.content, !post.isSaved)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdSummaryItem from './AdSummaryItem.vue'

export default {
  data () {
    return {
      // TODO: all of these should come from central state
      // need to set up some test user profile data first
      userSkills: ['Executive coaching'],
      userLocations: ['North-west London'],
      userInterests: ['Smoking pot']}
  },
  computed: {
    decoratedPosts () {
      const query = this.$store.getters['loggedin/favouritePostIds']
      return this.posts.map(
        post => { return {isSaved: query.includes(post.id), content: post} })
    },
    ...mapGetters({
      filteringBySkills: 'loggedin/posts/isFilteredBySkills',
      filteringByLocations: 'loggedin/posts/isFilteredByLocations',
      filteringByInterests: 'loggedin/posts/isFilteredByInterests',
      posts: 'loggedin/posts/getPosts'})
  },
  methods: {
    toggleSkillsFilter () {
      const newSkillsFilter = this.filteringBySkills
        ? []
        : this.userSkills
      this.$store.dispatch('loggedin/posts/setSkillsFilter', newSkillsFilter)
    },
    toggleLocationsFilter () {
      const newLocationsFilter = this.filteringByLocations
        ? []
        : this.userLocations
      this.$store.dispatch('loggedin/posts/setLocationsFilter', newLocationsFilter)
    },
    toggleInterestsFilter () {
      const newInterestsFilter = this.filteringByInterests
        ? []
        : this.userInterests
      this.$store.dispatch('loggedin/posts/setInterestsFilter', newInterestsFilter)
    }
  },
  created () {
    this.$store.dispatch('loggedin/posts/refresh')
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
