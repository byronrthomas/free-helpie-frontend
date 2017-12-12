<template>
  <div>
    <router-link tag="button" class="btn btn-default sidebar-button" :to="{name: 'latestPosts'}">Latest posts</router-link>
    <router-link tag="button" class="btn btn-default sidebar-button" :to="{name: 'mailbox'}" v-html="mailboxHtml"></router-link>
    <router-link tag="button" class="btn btn-default sidebar-button" :to="{name: 'yourPosts'}">Your posts</router-link>
    <router-link tag="button" class="btn btn-default sidebar-button" :to="{name: 'savedPosts'}">Saved Posts</router-link>
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
