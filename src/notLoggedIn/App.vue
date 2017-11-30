<template>
  <div class="container">
    <app-login-form 
        v-if="currentAction === 'login'" 
        @createUser="setAction('newUser')"/>
    <app-create-user-form
        v-if="currentAction === 'newUser'"
        @login="setAction('login')" />
  </div>
</template>

<script>
import LoginForm from './LoginForm.vue'
import CreateUserForm from './CreateUserForm.vue'
import {mapGetters, mapActions} from 'vuex'
export default {
  computed: {
    ...mapGetters({'currentAction': 'notloggedin/currentAction'})
  },
  components: {
      'app-login-form': LoginForm,
      'app-create-user-form': CreateUserForm
  },
  methods: {
    ...mapActions({'setAction': 'notloggedin/setAction'})
  }
}
</script>

<style>
</style>
