<template>
  <h2>Post {{ mode }}</h2>
</template>

<script>
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
  }
}
</script>
