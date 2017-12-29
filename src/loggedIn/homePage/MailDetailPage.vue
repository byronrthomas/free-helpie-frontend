<template>
  <div>
  <h2>Mail details</h2>
  <p>relatedToPostId: {{threadId.relatedToPostId}}</p>
  <p>threadAuthor: {{threadId.threadAuthor}}</p>
  </div>
</template>

<script>
export default {
  props: {
    threadId: Object
  }
}
</script>
