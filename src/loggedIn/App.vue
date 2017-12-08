<template>
  <div class="container"  style="background-color: #fffafa">
    <div class="row"  style="background-color: #ffffff" >
      <div class="col-xs-12">
        <img src="../assets/FreeHelp2.png" alt="FreeHelp" height=100px>
        <div class="pull-right" style="margin-top: 45px">
          <a class="topbar-link lead">Home</a>
          <a class="topbar-link lead">Profile</a>
          <a class="topbar-link lead">Account</a>
          <a class="topbar-link lead">Invite</a>
          <a class="topbar-link lead">Sign out</a>
        </div>
      </div>
    </div>
    <app-helper-profile-form 
      v-if="currentPage === 'profile'"
      :possible-locations="possibleLocations"
      :possible-skills="possibleSkills"
      :possible-interests="possibleInterests"
      :description-suggestion="profileTextSuggestion"/>
    <p v-if="currentPage === 'initialising'">Initialising...</p>
    <app-home-page v-if="currentPage === 'home'"/>
  </div>
</template>

<script>
import HelperProfile from './HelperProfile.vue'
import HomePage from './HomePage.vue'
import { LOCATIONS, SKILLS, CATEGORIES, PROFILE_TEXT_SUGGESTION } from './profileConstants'
import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      possibleLocations: LOCATIONS,
      possibleSkills: SKILLS,
      possibleInterests: CATEGORIES,
      profileTextSuggestion: PROFILE_TEXT_SUGGESTION
    }
  },
  computed: {
    ...mapGetters({'currentPage': 'loggedin/currentPage'})
  },
  components: {
    'app-helper-profile-form': HelperProfile,
    'app-home-page': HomePage
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
  .topbar-link {
    color: #777;
    margin-left: 10px;
    

  }
</style>
