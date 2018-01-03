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
    </post-summaries-container>
</template>

<script>
import { mapGetters } from 'vuex'
import PostSummariesContainer from './shared/PostSummariesContainer.vue'

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
      filteringBySkills: 'loggedin/latestposts/isFilteredBySkills',
      filteringByLocations: 'loggedin/latestposts/isFilteredByLocations',
      filteringByInterests: 'loggedin/latestposts/isFilteredByInterests',
      posts: 'loggedin/latestposts/getPosts',
      profileInfo: 'loggedin/latestposts/profileInfo',
      favouritePostIds: 'loggedin/favouritePostIds',
      userId: 'userId'})
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
