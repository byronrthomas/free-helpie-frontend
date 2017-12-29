<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <div class="row">
        <div class="col-sm-3">  <strong> {{ avatar.altText }} </strong> </div>
        <div class="col-sm-3 col-sm-offset-6"> <p style="float:right">{{ formattedSent }}</p></div>
      </div>
    </div>
    <div class="panel-body">
      {{ mail.text }}
    </div>
  </div>
</template>

<script>
import {formatDateTime} from './../../../formatUtils/formatDateTime'

export default {
  props: {
    mail: Object,
    avatar: Object
  },
  computed: {
    formattedSent () {
      return formatDateTime(this.mail.sent)
    }
  }
}
</script>
