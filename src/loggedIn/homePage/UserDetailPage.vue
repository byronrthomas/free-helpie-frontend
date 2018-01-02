<template>
  <user-detail-container :profile-data="profileData"/>
</template>

<script>
import UserDetailContainer from './UserDetailContainer.vue'
import {mapGetters} from 'vuex'

function makeEmptyFormData () {
  return {
    personalInfo: {
      name: '',
      photo: null
    },
    locations: [],
    interests: [],
    skills: [],
    description: '',
    locationTypes: [],
    timings: {
      regularAmount: {
        unit: '1hr',
        frequency: 'Week'},
      slots: []
    },
    agreedToTsAndCs: false
  }
}

export default {
  props: {
    userId: {
      type: Number
    }
  },
  computed: {
    profileData () {
      return this.profile || makeEmptyFormData()
    },
    ...mapGetters({'profile': 'loggedin/userdetails/profile'})
  },
  created () {
    this.$store.dispatch('loggedin/userdetails/getUser', this.userId)
  },
  components: {
    'user-detail-container': UserDetailContainer
  }
}
</script>

