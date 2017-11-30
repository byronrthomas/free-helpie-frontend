<template>
  <div class="container">
    <app-login-form 
        v-if="currentAction === 'login'" 
        @createUser="currentAction = 'newUser'"/>
    <app-create-user-form
        v-if="currentAction === 'newUser'"
        @login="currentAction = 'login'" />
  </div>
</template>

<script>
import LoginForm from './LoginForm.vue'
import CreateUserForm from './CreateUserForm.vue'
export default {
  data () {
    return { currentAction: 'login' }
  },
  components: {
      'app-login-form': LoginForm,
      'app-create-user-form': CreateUserForm
  }
}
</script>

<style>
</style>
