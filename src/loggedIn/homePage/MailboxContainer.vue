<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Your conversations</h3>
    </div>
    <div class="container table">
        <div class="row mailbox-header">
          <div class="col-xs-3"><strong>With</strong></div>
          <div class="col-xs-7"><strong>Subject</strong></div>
          <div class="col-xs-2"><strong>Sent</strong></div>
        </div>
        <mail-thread-summary-item
          v-for="summary in threadSummaries"
          :key="makeKey(summary)"
          :last-message-sent="getActivityDate(summary)"
          :subject="getSubject(summary)"
          :unread="getUnread(summary)"
          :with-name="getConversationName(summary)"
          role="button"
          @click.native="loadThread(summary)">
        </mail-thread-summary-item>
      
    </div>
  </div>


</template>

<script>
import MailThreadSummaryItem from './MailThreadSummaryItem.vue'

export default {
  props: {
    threadSummaries: Array,
    userId: Number,
    userInfos: Object,
    postInfos: Object
  },
  methods: {
    makeKey (summary) {
      const threadId = summary.threadId
      return `${threadId.relatedToPostId}-${threadId.threadAuthor}`
    },
    getOtherUserId (summary) {
      return this.authoredByUser(summary)
        ? summary.postAuthor
        : summary.threadId.threadAuthor
    },
    authoredByUser (summary) {
      return summary.threadId.threadAuthor === this.userId
    },
    getActivityDate (summary) {
      return summary.latestMessageSent
    },
    getUnread (summary) {
      return summary.unread
    },
    getConversationName (summary) {
      const otherUserInfo = this.userInfos[this.getOtherUserId(summary)] ||
        {name: '[unknown]'}
      return otherUserInfo.name
    },
    getSubject (summary) {
      const postInfo = this.postInfos[summary.threadId.relatedToPostId] ||
        {title: '...'}
      return postInfo.title
    },
    loadThread (summary) {
      this.$emit('loadThreadDetails', summary.threadId)
    }
  },
  components: {
    'mail-thread-summary-item': MailThreadSummaryItem
  }
}
</script>

<style>
  .mailbox-header {
    border-bottom: 1px;
    border-color: darkblue;
    border-left: 0px;
    border-right: 0px;
    border-style: solid;
    padding: 5px
  }
</style>
