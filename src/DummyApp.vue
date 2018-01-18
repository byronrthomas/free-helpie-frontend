<template>
  <div class="container">
    <post-edit-form 
      :initial-post-data="post"
      :create-or-update="'Create'"
      :possible-interests="['Cats']"
      :possible-locations="['Brum']"
      :possible-skills="['Gardening']"/>
  </div>
  
</template>


<script>
import PostEditForm from './loggedIn/homePage/PostEditForm.vue'
export default {
  data () {
    return {
      post: {
        postedBy: 1,
        title: '',
        interests: [],
        skills: [],
        locations: [],
        remote: false,
        description: '',
        timings: {regularAmount: {unit: '', frequency: ''}, slots: []},
        postType: 'helpWanted'
      }
    }
  },
  components: {
    'post-edit-form': PostEditForm
  }
}
</script>

