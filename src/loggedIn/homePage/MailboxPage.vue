<template>
    <mailbox-container 
    :thread-summaries="activeThreads"
    :user-id="userId"
    :user-infos="userInfo"
    :post-infos="postInfo"
    @loadThread="loadThread"
  />  

</template>

<script>
import MailboxContainer from './MailboxContainer.vue'
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters({
      'activeThreads': 'loggedin/activethreads/activeThreads',
      'userId': 'loggedin/userId',
      'postInfo': 'loggedin/mailboxposts/getPosts',
      'userInfo': 'loggedin/mailboxusers/userInfo'
    })
  },
  methods: {
    loadThread (threadInfo) {
      const route = `maildetail?post=${threadInfo.relatedToPostId}author=${threadInfo.threadAuthor}`
    }
  },
  created () {
    this.$store.dispatch('loggedin/activethreads/refreshThreads')
  },
  watch: {
    activeThreads (newValue) {
      const postIdsToFind = newValue.map(thread => thread.threadId.relatedToPostId).distinct()
      const usersToFind = newValue.map(thread => thread.threadId.threadAuthor).distinct()
      usersToFind.concat(newVaule.map(thread => thread.postAuthor).distinct())
      this.$store.dispatch('loggedin/mailboxposts/setPostIdsFilter', postIdsToFind)
      this.$store.dispatch('loggedin/mailboxusers/getUserInfo', usersToFind)
    }
  },
  components: {
    'mailbox-container': MailboxContainer
  }
}
</script>

