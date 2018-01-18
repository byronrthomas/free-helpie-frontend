<template>
  <div>
    <div :class="alertClass" role="alert" v-if="alerting">
      <p>{{alertText}}</p>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    alertText: {
      type: String,
      required: true
    },
    alerting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      alertClass: {
        'alert': true,
        'alert-danger': true,
        'strong': true
      }
    }
  }
}
</script>
