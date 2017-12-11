<template>
    <ad-summaries-container 
      :posts="posts" 
      :favourite-post-ids="favouritePostIds"
      @viewPost="$emit('viewPost', $event)"
      @updateFavouritePosts="updateFavouritePosts">
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
    </ad-summaries-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AdSummariesContainer from './shared/AdSummariesContainer.vue'

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
    ...mapGetters({
      filteringBySkills: 'loggedin/posts/isFilteredBySkills',
      filteringByLocations: 'loggedin/posts/isFilteredByLocations',
      filteringByInterests: 'loggedin/posts/isFilteredByInterests',
      posts: 'loggedin/posts/getPosts',
      favouritePostIds: 'loggedin/favouritePostIds'})
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
    },
    updateFavouritePosts (post, shouldBeFavourited) {
      this.$emit('updateFavouritePosts', post, shouldBeFavourited)
    }
  },
  created () {
    this.$store.dispatch('loggedin/posts/refresh')
  },
  components: {
    'ad-summaries-container': AdSummariesContainer
  }
}
</script>

<style>
</style>
