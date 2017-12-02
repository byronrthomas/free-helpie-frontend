<template>
  <div class="row">
    <div class="col-xs-12">
      <br><br>
      <div class="alert alert-info">
        You need to verify your email address to access the full site. We have sent a verification email to you, please click the link on the email.
      </div>
    </div>
  </div>
</template>


<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  mounted() {
    setTimeout(this.simulateVerificationReceived, 3000);
  },
  computed: {
    ... mapGetters(['userName'])
  },
  methods: {
    simulateVerificationReceived() {
      if (confirm('TEST: Simulating verification email - have they verified?')) {
        this.userVerificationReceived(this.userName);
        this.setAction('login');
      }
    },
    // Deliberately using the store directly here, as in a non-test environment
    // this component wouldn't use the store so wouldn't need to emit events
    ... mapActions({
      'userVerificationReceived': 'userVerificationReceived',
      'setAction' : 'notloggedin/setAction'})
  },

}
</script>

<style>
</style>
