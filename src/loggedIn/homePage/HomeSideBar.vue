<template>
  <div>
    <button class="btn btn-default sidebar-button" @click="$emit('gotoLatestAds')">Latest posts</button>
    <button class="btn btn-default sidebar-button" v-html="mailboxHtml" @click="alert('Not yet implemented, would view mailbox')"></button>
    <button class="btn btn-default sidebar-button" @click="alert('Not yet implemented, would view posts created by user')">Your posts</button>
    <button class="btn btn-default sidebar-button" @click="alert('Not yet implemented, would view posts saved (favourited) by user')">Saved posts</button>
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
  },
  methods: {
    alert (msg) {
      alert(msg)
    }
  }
}
</script>

<style>
   .sidebar-button {
     width: 100%;
     margin-top: 10px
   }
</style>
