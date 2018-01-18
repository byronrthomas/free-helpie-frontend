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
        <button
          class="btn"
          @click="cyclePostTypeFilter"
          :class="{'btn-primary': filteringByPostType}">
          {{postTypeFilterText}}
        </button>        
      </div>
    </div>
    <div class="row" v-if="isFiltered">
      <div class="col-xs-12">
        <div class="alert alert-info">
          <strong>Filtering by:</strong>
          <p v-if="filteringByPostType"> {{postTypeFilterDescription}}</p>
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
import { HELP_OFFERED, HELP_WANTED } from './postTypes'

function formatFilterList (filterType, list) {
  return list.length === 0
    ? `${filterType}: NONE - will return no results`
    : `${filterType}: ${list.join(' OR ')}`
}

const POST_TYPE_CYCLE = [null, HELP_WANTED, HELP_OFFERED]

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
    postTypeFilterDescription () {
      return 'ONLY ' + this.postTypeFilterText
    },
    isFiltered () {
      return this.filteringBySkills || this.filteringByLocations || this.filteringByInterests || this.filteringByPostType
    },
    postTypeFilter () {
      return POST_TYPE_CYCLE[this.postTypeFilterIndex]
    },
    postTypeFilterText () {
      return this.postTypeFilter === null
        ? 'All posts'
        : this.postTypeFilter === HELP_OFFERED
          ? 'Help offered posts'
          : 'Help wanted posts'
    },
    ...mapGetters({
      filteringBySkills: 'loggedin/latestposts/isFilteredBySkills',
      filteringByLocations: 'loggedin/latestposts/isFilteredByLocations',
      filteringByInterests: 'loggedin/latestposts/isFilteredByInterests',
      filteringByPostType: 'loggedin/latestposts/isFilteredByPostType',
      posts: 'loggedin/latestposts/getPosts',
      profileInfo: 'loggedin/latestposts/profileInfo',
      favouritePostIds: 'loggedin/favouritePostIds',
      userId: 'userId',
      userProfile: 'loggedin/userProfile'})
  },
  data () {
    return {
      postTypeFilterIndex: 0
    }
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
    cyclePostTypeFilter () {
      this.postTypeFilterIndex = (this.postTypeFilterIndex + 1) % POST_TYPE_CYCLE.length
      const nextFilter = POST_TYPE_CYCLE[this.postTypeFilterIndex]
      const newPostTypesFilter = nextFilter ? [nextFilter] : null

      this.$store.dispatch('loggedin/latestposts/setPostTypeFilter', newPostTypesFilter)
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
