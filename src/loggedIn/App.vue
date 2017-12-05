<template>
  <div class="container">
    <app-helper-profile-form 
      :possible-locations="possibleLocations"
      :possible-skills="possibleSkills"
      :possible-categories="possibleCategories"
      :description-suggestion="profileTextSuggestion"/>
  </div>
</template>

<script>
import HelperProfile from './HelperProfile.vue'
import { LOCATIONS, SKILLS, CATEGORIES, PROFILE_TEXT_SUGGESTION } from './profileConstants'
// import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      possibleLocations: LOCATIONS,
      possibleSkills: SKILLS,
      possibleCategories: CATEGORIES,
      profileTextSuggestion: PROFILE_TEXT_SUGGESTION
    }
  },
  // computed: {
  //   ...mapGetters({'currentAction': 'notloggedin/currentAction'})
  // },
  // data () {
  //   return {usernameForVerification: ''}
  // },
  components: {
    'app-helper-profile-form': HelperProfile
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
