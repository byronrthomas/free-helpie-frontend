<template>
  <div class="row mail-thread-summary" :class="classForRow">
    <div class="col-xs-3" :class="classForElement">
      <strong-if-true :condition="unread" :text="withName"/>
    </div>
    <div class="col-xs-7" :class="classForElement">
      <strong-if-true :condition="unread" :text="subject"/>
    </div>
    <div class="col-xs-2" :class="classForElement">
      <strong-if-true :condition="unread" :text="formattedDate"/>
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '../../formatUtils/formatDateTime'
import StrongIfTrue from './shared/StrongIfTrue.vue'

export default {
  props: {
    unread: Boolean,
    withName: String,
    subject: String,
    lastMessageSent: Date
  },
  computed: {
    classForElement () {
      return {'unread-thread': this.unread, 'read-thread': !this.unread}
    },
    classForRow () {
      return {'read-thread-row': !this.unread}
    },
    formattedDate () {
      return formatDateTime(this.lastMessageSent)
    }
  },
  components: {
    'strong-if-true': StrongIfTrue
  }
}
</script>

<style>
  .unread-thread {
    color: black
  }
  .read-thread {
    color: black;
  }
  .read-thread-row {
    background-color: #eaeaea;
  }
  .mail-thread-summary {
    border-top: 1px;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 0px;
    border-style: solid;
    border-color: lightgray;
    padding: 5px
  }
</style>
