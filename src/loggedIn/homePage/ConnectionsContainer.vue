<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">{{ headerText }}</h3>
    </div>
    <div class="container table">
        <div class="row connections-header">
          <div class="col-xs-3 col-xs-offset-2"><strong>With</strong></div>
          <div class="col-xs-5"><strong>About post</strong></div>
          <div class="col-xs-2"><strong>Invite sent</strong></div>
        </div>
        <connection-summary-item
          v-for="(summary, index) in summaries"
          :key="index"
          :invite-sent="getActivityDate(summary)"
          :post-subject="getSubject(summary)"
          :next-action="nextAction"
          :with-name="getConversationName(summary)">
        </connection-summary-item>
      
    </div>
  </div>


</template>

<script>
import ConnectionSummaryItem from './ConnectionSummaryItem.vue'

export default {
  props: {
    summaries: Array,
    headerText: String,
    nextAction: String
  },
  methods: {
    getActivityDate (summary) {
      return summary.inviteSent
    },
    getConversationName (summary) {
      return summary.withName
    },
    getSubject (summary) {
      return summary.postSubject
    }
  },
  components: {
    'connection-summary-item': ConnectionSummaryItem
  }
}
</script>

<style>
  .connections-header {
    border-bottom: 1px;
    border-color: darkblue;
    border-left: 0px;
    border-right: 0px;
    border-style: solid;
    padding: 5px
  }
</style>
