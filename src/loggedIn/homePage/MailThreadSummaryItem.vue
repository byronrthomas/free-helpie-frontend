<template>
  <div class="row">
    <div class="col-xs-2" :class="classForThread">{{ withName }}</div>
    <div class="col-xs-8" :class="classForThread">{{ subject }}</div>
    <div class="col-xs-2" :class="classForThread">{{ formattedDate }}</div>
  </div>
</template>

<script>
import {formatDateTime} from '../../../format-utils/formatDateTime'

export default {
  props: {
    unread: Boolean,
    withName: String,
    subject: String,
    lastMessageSent: Date
  },
  computed: {
    classForThread () {
      return {'unread-thread' : this.unread, 'read-thread': !this.unread}
    },
    formattedDate () {
      return formatDateTime(this.lastMessageSent)
    }
  }
}
</script>

<style scoped>
  unread-thread {
    color: red
  }
  read-thread {
    color: black
  }
</style>
