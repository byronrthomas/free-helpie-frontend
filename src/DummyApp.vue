<template>
  <user-detail-container
    :profile-data="profileData"
  />  
</template>

<script>
import UserDetailContainer from './loggedIn/homePage/UserDetailContainer.vue'
import {INITIAL_USER_DATA} from './store/mockServer/initialUserData'

export default {
  data () {
    return {
      profileData: INITIAL_USER_DATA['0']}
  },
  components: {
    'user-detail-container': UserDetailContainer
  }
}
</script>

