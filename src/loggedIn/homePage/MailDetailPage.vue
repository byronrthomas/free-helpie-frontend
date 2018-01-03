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
      const message = `You have asked to connect with ${this.otherName} - normally this ` +
        'would mean that they get an invite to connect and can choose to connect with you (see' +
        ' Your Connections for more info) to share contact details. This is not yet implemented.'
      alert(message)
    },
    cancelConnection () {
      const message = `You have asked to cancel your connection with ${this.otherName} - normally this` +
        ' would mean that your invite to connect is withdrawn and you will not be sharing' +
        ' contact details any more. This is not yet implemented.'
      alert(message)
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
      return this.mailItems.length > 0
        ? 'connectAllowed'
        : 'disabled'
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
      mailItems: 'loggedin/threaddetails/mailItems'})
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
