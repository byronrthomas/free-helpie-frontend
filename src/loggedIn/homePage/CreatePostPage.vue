<template>
  <post-edit-form 
    :initial-post-data="post"
    :create-or-update="'Create'"
    :possible-interests="possibleInterests"
    :possible-locations="possibleLocations"
    :possible-skills="possibleSkills"
    @submitForm="handleSubmit"/>
</template>

<script>
import PostEditForm from './PostEditForm.vue'
import {LOCATIONS, SKILLS, INTERESTS} from '../profileConstants'
import {mapGetters} from 'vuex'
import { isValidPostType } from './postTypes'

function makeEmptyPost (postedBy, postType) {
  return {
    postedBy,
    title: '',
    interests: [],
    skills: [],
    locations: [],
    remote: false,
    description: '',
    timings: {regularAmount: {unit: '', frequency: ''}, slots: []},
    postType
  }
}

export default {
  props: {
    postType: {
      validator: isValidPostType
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
    post () {
      return makeEmptyPost(this.userId, this.postType)
    },
    ...mapGetters({'userId': 'userId'})
  },
  components: {
    'post-edit-form': PostEditForm
  },
  methods: {
    createSucceeded () {
      alert('Your post has been successfully created, redirecting to latest posts...')
      this.$router.push({name: 'latestPosts'})
    },
    handleSubmit (post) {
      const action = 'createPost'
      this.$store.dispatch('loggedin/editpost/' + action, {post, successCallback: this.createSucceeded})
    }
  }
}
</script>
