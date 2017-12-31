<template>
  <div class="row connection-summary">
    <div class="col-xs-2">
      <button class="btn btn-primary" @click="explainAction">{{nextAction}}</button>
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
    explainAction () {
      if (this.nextAction === 'Accept invite') {
        alert('If you clicked this button, the invite would be accepted, the' +
        ' other user would be able to see your contact details and you could see theirs.' +
        ' This connection would become an Active connection. However, this isn\'t implemented yet.')
      } else if (this.nextAction === 'Cancel invite') {
        alert('If you clicked this button, your invite to connect would be canceled, without the other user being able to see your contact details.' +
        ' This connection would be deleted. However, this isn\'t implemented yet.')
      } else if (this.nextAction === 'Cancel sharing') {
        alert('If you clicked this button, you would stop sharing your contact details with the other user (however they might have already seen yours). You would not be able to see their details any more.' +
        ' This connection would be deleted. However, this isn\'t implemented yet.')
      }
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
