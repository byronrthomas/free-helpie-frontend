<template>
  <div>
  <mail-thread-container
    :connect-or-cancel-allowed="cancelConnectAllowed"
    :conversation-header-text="conversationHeaderText"
    :mail-items="mailItems"
    :my-avatar="myAvatar"
    :other-avatar="otherAvatar"
    :user-id="userId"
    @sendMail="sendMail($event)"
    @readUpToTimestamp="markAsRead"
    @makeConnection="makeConnection"
    @cancelConnection="cancelConnection"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MailThreadContainer from './shared/MailThreadContainer.vue'

export default {
  data () {
    return {
      myAvatar: {altText: 'You'}
    }
  },
  props: {
    threadId: Object,
    postAuthor: Number
  },
  methods: {
    sendMail (mailText) {
      this.$store.dispatch('loggedin/threaddetail/newMail', {relatedToPostId: this.threadId.relatedToPostId, threadAuthor: this.threadId.threadAuthor, mailText: mailText})
    },
    markAsRead (latestReadTimestamp) {
      const reqData = {
        timestampReadUpTo: latestReadTimestamp,
        relatedToPostId: this.threadId.relatedToPostId,
        threadAuthor: this.threadId.threadAuthor
      }
      this.$store.dispatch('loggedin/threaddetails/markThreadAsRead', reqData)
    },
    makeConnection () {
      this.$store.dispatch('loggedin/userconnections/inviteConnection', {
        otherUser: this.otherUserId,
        relatedToPostId: this.threadId.relatedToPostId
      })
    },
    cancelConnection () {
      this.$store.dispatch('loggedin/userconnections/cancelConnection', this.otherUserId)
    }
  },
  computed: {
    conversationHeaderText () {
      return `Your conversation with ${this.otherName}`
    },
    amThreadAuthor () {
      return this.userId === this.threadId.threadAuthor
    },
    cancelConnectAllowed () {
      return this.connectionInvitesFromMe.find(invite => invite.otherUser === this.otherUserId)
        ? 'cancelAllowed'
        : (this.mailItems.length > 0
          ? 'connectAllowed'
          : 'disabled')
    },
    otherUserId () {
      const posterId = parseInt(this.postAuthor)
      return this.amThreadAuthor ? posterId : this.threadId.threadAuthor
    },
    otherName () {
      const userData = this.profileInfo[this.otherUserId] || {name: '[unknown]'}
      return userData.name
    },
    otherAvatar () {
      return {altText: this.otherName}
    },
    ...mapGetters({
      'profileInfo': 'loggedin/threaddetailsusers/userInfo',
      'userId': 'userId',
      mailItems: 'loggedin/threaddetails/mailItems',
      connectionInvitesFromMe: 'loggedin/userconnections/connectionInvitesFromMe'})
  },
  created () {
    const mailThreadQuery = {
      relatedToPostId: this.threadId.relatedToPostId,
      threadAuthor: this.threadId.threadAuthor,
      sortField: 'sent',
      sortOrderAsc: true
    }
    this.$store.dispatch('loggedin/threaddetails/getMailThread', mailThreadQuery)
    this.$store.dispatch('loggedin/threaddetailsusers/getUserInfo', [this.otherUserId])
  },
  components: {
    'mail-thread-container': MailThreadContainer
  }
}
</script>
