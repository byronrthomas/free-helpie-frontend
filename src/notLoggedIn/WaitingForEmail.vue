<template>
  <div class="row">
    <div class="col-xs-12">
      <template v-if="!verificationSucceeded">
        <br><br>
        <div class="alert alert-info">
          You need to verify your email address to access the full site. We have sent a verification email to you, please click the link on the email.
        </div>
      </template>
      <template v-else>
        <h3>Thanks for verifying your email {{ this.userName }}</h3>
        <p>Redirecting you to the login page...</p>
      </template>
      
    </div>
  </div>
</template>


<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  mounted() {
    setTimeout(this.simulateVerificationReceived, 3000);
  },
  data() {
    return {verificationSucceeded: false};
  },
  computed: {
    ... mapGetters(['userName'])
  },
  methods: {
    simulateVerificationReceived() {
      if (confirm('TEST: Simulating verification email - have they verified?')) {
        this.userVerificationReceived(this.userName);
        this.verificationSucceeded = true;
        setTimeout(() => this.setAction('login'), 4000);
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
