<template>
  <div class="row">
    <!-- <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset 3"> -->
    <div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-md-3 col-md-offset-4">
      <h2>Login</h2>
      <div v-bind:class="formDivClass">
        <div class="form-group">
          <label for="Email">Email</label>
          <input type="email" v-model="userDetails.username" class="form-control">
        </div>
        <div class="form-group">
          <label for="Password">Password</label>
          <input type="password" v-model="userDetails.password" class="form-control">
        </div>
        <p v-if="lastServerError">{{ lastServerError }}</p>
      </div>
      <button 
        class="btn btn-primary" 
        @click="$emit('authUser', userDetails)">
        Login
        </button>        
      <br><br>
      <a @click="$emit('gotoNewUser')">Create an account</a>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return { userDetails: {username: '', password: ''} }
  },
  computed: {
    formDivClass () {
      return {
        'alert': this.lastServerError,
        'alert-danger': this.lastServerError
      }
    },
    ...mapGetters(['lastServerError'])
  }
}
</script>

<style>
</style>
