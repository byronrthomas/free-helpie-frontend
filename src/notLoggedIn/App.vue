<template>
  <div class="container">
    <app-login-form 
        v-if="currentAction === 'login'" 
        @gotoNewUser="setAction('newUser')"
        @authUser="authUser"/>
    <app-create-user-form
        v-if="currentAction === 'newUser'"
        @gotoLogin="setAction('login')"
        @createUser="handleCreateUser" />
    <app-waiting-for-email
        :username="usernameForVerification"
        v-if="currentAction === 'waitingForEmail'"/>
  </div>
</template>

<script>
import LoginForm from './LoginForm.vue'
import CreateUserForm from './CreateUserForm.vue'
import WaitingForEmail from './WaitingForEmail.vue'
import {mapGetters, mapActions} from 'vuex'
export default {
  computed: {
    ...mapGetters({'currentAction': 'notloggedin/currentAction'})
  },
  data() {
    return {usernameForVerification: ''};
  },
  components: {
      'app-login-form': LoginForm,
      'app-create-user-form': CreateUserForm,
      'app-waiting-for-email': WaitingForEmail
  },
  methods: {
    handleCreateUser(userDetails) {
      this.usernameForVerification = userDetails.username;
      this.createUser(userDetails);
    },
    ...mapActions({
      'setAction': 'notloggedin/setAction',
      'createUser': 'notloggedin/createUser',
      'authUser': 'authUser'})
  }
}
</script>

<style>
</style>
