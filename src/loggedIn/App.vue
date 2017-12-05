<template>
  <div class="container">
    <app-helper-profile-form 
      v-if="currentPage === 'profile'"
      :possible-locations="possibleLocations"
      :possible-skills="possibleSkills"
      :possible-categories="possibleCategories"
      :description-suggestion="profileTextSuggestion"/>
    <p v-if="currentPage === 'initialising'">Initialising...</p>
    <p v-if="currentPage === 'home'">You're home boy!!</p>
  </div>
</template>

<script>
import HelperProfile from './HelperProfile.vue'
import { LOCATIONS, SKILLS, CATEGORIES, PROFILE_TEXT_SUGGESTION } from './profileConstants'
import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      possibleLocations: LOCATIONS,
      possibleSkills: SKILLS,
      possibleCategories: CATEGORIES,
      profileTextSuggestion: PROFILE_TEXT_SUGGESTION
    }
  },
  computed: {
    ...mapGetters({'currentPage': 'loggedin/currentPage'})
  },
  components: {
    'app-helper-profile-form': HelperProfile
  },
  created() {
    this.$store.dispatch('loggedin/initialise')
  }
  // methods: {
  //   handleCreateUser (userDetails) {
  //     this.usernameForVerification = userDetails.username
  //     this.createUser(userDetails)
  //   },
  //   ...mapActions({
  //     'setAction': 'notloggedin/setAction',
  //     'createUser': 'notloggedin/createUser',
  //     'authUser': 'authUser'})
  // }
}
</script>

<style>
</style>
