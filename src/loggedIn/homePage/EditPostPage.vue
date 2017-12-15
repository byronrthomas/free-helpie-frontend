<template>
  <post-edit-form 
    v-if="isInitialised"
    :initial-post-data="post"
    :create-or-update="createOrUpdate"
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

function makeEmptyPost (postedBy) {
  return {
    postedBy: postedBy,
    title: '',
    interests: [],
    skills: [],
    locations: [],
    remote: false,
    description: '',
    timings: {regularAmount: {unit: '', frequency: ''}, slots: []}
  }
}

export default {
  props: {
    postId: {
      default () {
        return NaN
      }
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
    inCreateMode () {
      return isNaN(this.postId)
    },
    createOrUpdate () {
      return this.inCreateMode
        ? 'Create'
        : 'Update'
    },
    isInitialised () {
      return this.inCreateMode || Boolean(this.storedPost)
    },
    post () {
      return this.inCreateMode
        ? makeEmptyPost(this.username)
        : this.storedPost
    },
    ...mapGetters({'storedPost': 'loggedin/editpost/post', 'username': 'username'})
  },
  components: {
    'post-edit-form': PostEditForm
  },
  methods: {
    handleSubmit (post) {
      const action = this.inCreateMode
        ? 'createPost'
        : 'updatePost'
      this.$store.dispatch('loggedin/editpost/' + action, post)
    }
  },
  created () {
    if (!this.inCreateMode) {
      // Clear out previous form data first
      this.$store.commit('loggedin/editpost/setPost', null)
      this.$store.dispatch('loggedin/editpost/getPost', this.postId)
    }
  }
}
</script>
