<template>
  <post-edit-form 
    v-if="isInitialised"
    :initial-post-data="post"
    :create-or-update="'Update'"
    :possible-interests="possibleInterests"
    :possible-locations="possibleLocations"
    :possible-skills="possibleSkills"
    @submitForm="handleSubmit"/>
  <p v-else>Initialising...</p>
</template>

<script>
import PostEditForm from './PostEditForm.vue'
import {LOCATIONS, SKILLS, INTERESTS} from '../profileConstants'
import {mapGetters} from 'vuex'

export default {
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      possibleSkills: SKILLS,
      possibleLocations: LOCATIONS,
      possibleInterests: INTERESTS
    }
  },
  computed: {
    isInitialised () {
      return Boolean(this.storedPost)
    },
    post () {
      return this.storedPost
    },
    ...mapGetters({'storedPost': 'loggedin/editpost/post'})
  },
  components: {
    'post-edit-form': PostEditForm
  },
  methods: {
    updateSucceeded () {
      alert('Updates have been saved')
    },
    handleSubmit (post) {
      const action = 'updatePost'
      this.$store.dispatch('loggedin/editpost/' + action, {updatedPost: post, successCallback: this.updateSucceeded})
    }
  },
  created () {
    // Clear out previous form data first
    this.$store.commit('loggedin/editpost/setPost', null)
    this.$store.dispatch('loggedin/editpost/getPost', this.postId)
  }
}
</script>
