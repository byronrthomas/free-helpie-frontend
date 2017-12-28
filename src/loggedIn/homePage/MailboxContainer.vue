<template>
  <div class="container">
    <mail-thread-summary-item
      v-for="summary in threadSummaries"
      :key="makeKey(summary)"
      :last-message-sent="getActivityDate(summary)"
      :subject="getSubject(summary)"
      :unread="getUnread(summary)"
      :with-name="getConversationName(summary)">
    </mail-thread-summary-item>
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
      const otherUserInfo = this.userInfos[this.getOtherUserId(summary)]
        || {name: '[unknown]'}
      return otherUserInfo.name
    },
    getSubject (summary) {
      const postInfo = this.postInfos[summary.threadId.relatedToPostId]
        || {title: '...'}
      return postInfo.title
    }
  },
  components: {
    'mail-thread-summary-item': MailThreadSummaryItem
  }
}
</script>

