<template>
  <div class="row connection-summary">
    <div class="col-xs-2">
      <button class="btn btn-primary" @click="actionClicked">{{nextAction}}</button>
    </div>
    <div class="col-xs-3">
      {{ withName }}
    </div>
    <div class="col-xs-5">
      {{ postSubject }}
    </div>
    <div class="col-xs-2"> {{formattedDate }}
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '../../formatUtils/formatDateTime'

export default {
  props: {
    withName: String,
    postSubject: String,
    inviteSent: Date,
    nextAction: String
  },
  computed: {
    formattedDate () {
      return formatDateTime(this.inviteSent)
    }
  },
  methods: {
    actionClicked () {
      this.$emit('actionClicked')
    }
  }
}
</script>

<style>
  .connection-summary {
    border-top: 1px;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 0px;
    border-style: solid;
    border-color: lightgray;
    padding: 5px
  }
</style>
