<template>
  <div>
    <div class="row">
      <div class="col-xs-2 col-xs-offset-10"> {{ formattedSent }} </div>
    </div>
    <div class="row">
      <div class="col-xs-2">
        <h3> {{ avatar.altText }} </h3>
      </div>
      <div class="col-xs-10">
        <span>{{ mail.text }}</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    mail: Object,
    avatar: Object
  },
  computed: {
    formattedSent () {
      return this.mail.sent.toString()
    }
  }
}
</script>
