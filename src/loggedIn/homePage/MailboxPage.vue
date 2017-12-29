<template>
    <mailbox-container 
    :thread-summaries="activeThreads"
    :user-id="userId"
    :user-infos="userInfo"
    :post-infos="postInfo"
    @loadThreadDetails="loadThread"
  />  

</template>

<script>
import MailboxContainer from './MailboxContainer.vue'
import {mapGetters} from 'vuex'

function arrayDistinct (inputArray) {
  const outputSet = new Set(inputArray)
  return Array.from(outputSet.keys())
}

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
      const route = `maildetail?post=${threadInfo.relatedToPostId}&author=${threadInfo.threadAuthor}&poster=${threadInfo.postAuthor}`
      this.$router.push(route)
    }
  },
  created () {
    this.$store.dispatch('loggedin/activethreads/refreshThreads')
  },
  watch: {
    activeThreads (newValue) {
      const postIdsToFind = arrayDistinct(newValue.map(thread => thread.threadId.relatedToPostId))
      const threadUsersToFind = arrayDistinct(newValue.map(thread => thread.threadId.threadAuthor))
      const postUsersToFind = arrayDistinct(newValue.map(thread => thread.postAuthor))
      this.$store.dispatch('loggedin/mailboxposts/setPostIdsFilter', postIdsToFind)
      this.$store.dispatch('loggedin/mailboxusers/getUserInfo', threadUsersToFind.concat(postUsersToFind))
    }
  },
  components: {
    'mailbox-container': MailboxContainer
  }
}
</script>

