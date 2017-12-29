<template>
  <div>
  <h3>Your conversation with {{ otherName }}</h3>
  <mail-thread-container
    :connect-or-cancel-allowed="'disabled'"
    :mail-items="mailItems"
    :my-avatar="myAvatar"
    :other-avatar="otherAvatar"
    :user-id="userId"
    @sendMail="sendMail($event)"/>
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
    }
  },
  computed: {
    amThreadAuthor () {
      return this.userId === this.threadId.threadAuthor
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
      'userId': 'loggedin/userId',
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
  watch: {
    mailItems (value) {
      if (value.length > 0) {
        const times = value.map(mail => mail.sent.getTime())
        const maxTime = new Date()
        const maxT = Math.max(...times)
        maxTime.setTime(maxT)
        console.log('maxTime = ', maxTime)
        console.log('times = ', times)
        const reqData = {
          timestampReadUpTo: maxTime,
          relatedToPostId: this.threadId.relatedToPostId,
          threadAuthor: this.threadId.threadAuthor
        }
        this.$store.dispatch('loggedin/threaddetails/markThreadAsRead', reqData)
      }
    }
  },
  components: {
    'mail-thread-container': MailThreadContainer
  }
}
</script>
