<template>
  <h2>Post {{ mode }}</h2>
</template>

<script>
import PostEditForm from './PostEditForm.vue'
// function makeEmptyFormData () {
//   return {
//     createOrUpdate: 'Create',
//     personalInfo: {
//       name: '',
//       photo: null
//     },
//     helperLocations: [],
//     helperInterests: [],
//     helperSkills: [],
//     helperDescription: '',
//     helperLocationTypes: [],
//     helperTimings: {
//       regularAmount: {
//         unit: '1hr',
//         frequency: 'Week'},
//       slots: []
//     },
//     helperAgreedToTsAndCs: false
//   }
// }

export default {
  props: {
    postId: {
      default () {
        return NaN
      }
    }
  },
  computed: {
    mode () {
      return isNaN(this.postId)
        ? 'Create'
        : 'Edit ' + this.postId
    }
  },
  components: {
    'post-edit-form': PostEditForm
  }
}
</script>
