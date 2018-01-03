<template>
    <post-summaries-container 
      :posts="posts" 
      :favourite-post-ids="favouritePostIds"
      :profile-info="profileInfo"
      :logged-in-user-id="userId"
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
    <div class="row" v-if="isFiltered">
      <div class="col-xs-12">
        <div class="alert alert-info">        
          <strong>Filtering by:</strong>
          <p v-if="filteringBySkills"> {{skillsFilterDescription}} </p>
          <p v-if="filteringByInterests"> {{interestsFilterDescription}} </p>
          <p v-if="filteringByLocations"> {{locationsFilterDescription}} </p>
        </div>
        </div>
    </div>
      
    </post-summaries-container>
</template>

<script>
import { mapGetters } from 'vuex'
import PostSummariesContainer from './shared/PostSummariesContainer.vue'

function formatFilterList(filterType, list) {
  return list.length === 0 
    ? `${filterType}: NONE - will return no results`
    : `${filterType}: ${list.join(' OR ')}`
}

export default {
  computed: {
    userSkills () {
      return this.userProfile.skills
    },
    userLocations () {
      // TODO: should handle remote correctly here
      return this.userProfile.locations
    },
    userInterests () {
      return this.userProfile.interests
    },
    skillsFilterDescription () {
      return formatFilterList('Skills', this.userSkills)
    },
    interestsFilterDescription () {
      return formatFilterList('Interests', this.userInterests)
    },
    locationsFilterDescription () {
      const listOfLocations = [...this.userLocations]
      if (this.userProfile.locationTypes.includes['Remote']) {
        listOfLocations.push('REMOTE')  
      }
      return formatFilterList('Locations', listOfLocations)
    },        
    isFiltered () {
      return this.filteringBySkills || this.filteringByLocations || this.filteringByInterests
    },
    ...mapGetters({
      filteringBySkills: 'loggedin/latestposts/isFilteredBySkills',
      filteringByLocations: 'loggedin/latestposts/isFilteredByLocations',
      filteringByInterests: 'loggedin/latestposts/isFilteredByInterests',
      posts: 'loggedin/latestposts/getPosts',
      profileInfo: 'loggedin/latestposts/profileInfo',
      favouritePostIds: 'loggedin/favouritePostIds',
      userId: 'userId',
      userProfile: 'loggedin/userProfile'})
  },
  methods: {
    toggleSkillsFilter () {
      const newSkillsFilter = this.filteringBySkills
        ? null
        : this.userSkills
      this.$store.dispatch('loggedin/latestposts/setSkillsFilter', newSkillsFilter)
    },
    toggleLocationsFilter () {
      const newLocationsFilter = this.filteringByLocations
        ? null
        : this.userLocations
      this.$store.dispatch('loggedin/latestposts/setLocationsFilter', newLocationsFilter)
    },
    toggleInterestsFilter () {
      const newInterestsFilter = this.filteringByInterests
        ? null
        : this.userInterests
      this.$store.dispatch('loggedin/latestposts/setInterestsFilter', newInterestsFilter)
    },
    updateFavouritePosts (post, shouldBeFavourited) {
      const storeAction = shouldBeFavourited ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + storeAction, post)
    }
  },
  created () {
    this.$store.dispatch('loggedin/latestposts/refresh')
  },
  components: {
    'post-summaries-container': PostSummariesContainer
  }
}
</script>

<style>
</style>
