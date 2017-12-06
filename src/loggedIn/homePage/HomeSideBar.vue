<template>
  <div>
    <button class="btn btn-primary">Latest posts</button>
    <button class="btn btn-primary" v-html="mailboxHtml"></button>
    <button class="btn btn-primary">Your posts</button>
    <button class="btn btn-primary">Saved posts</button>
  </div>
</template>

<script>
export default {
  props: {
    'unreadEmailCount': Number
  },
  computed: {
    mailboxHtml () {
      if (this.unreadEmailCount === 0) {
        return 'Mailbox'
      } else {
        return `<strong>Mailbox (${this.unreadEmailCount})</strong>` 
      }
    }
  }
}
</script>

<style>
</style>
