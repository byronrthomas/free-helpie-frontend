<template>
  <div class="row">
    <!-- <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset 3"> -->
    <div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-md-3 col-md-offset-4">
      <h2>Create new user</h2>
      <div class="form-group">
        <label for="Email">Email</label>
        <input type="email" v-model="userDetails.username" class="form-control">
      </div>
      <div class="form-group">
        <label for="Password">Password</label>
        <input type="password" v-model="userDetails.password" class="form-control">
      </div>
      <div class="form-group">
        <label for="passwordAgain">Confirm Password</label>
        <input type="password" v-model="passwordAgain" class="form-control">
      </div>
      <p class="problem" v-if="passwordsDontMatch">These passwords don't match</p>
      <button 
        class="btn btn-primary" 
        @click="createUser(userDetails)">
        Create Account
        </button>        
      <br><br>
      <a @click="$emit('login')">Login as existing user</a>
    </div>
  </div>
</template>


<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return { 
        userDetails: {username: '', password: ''},
        passwordAgain: '' 
        }
  },
  computed: {
      passwordsDontMatch() {
          return this.userDetails.password !== this.passwordAgain;
      }
  },
  methods: {
    ...mapActions(['createUser'])
  }
}
</script>

<style>
    .problem {
        color: red
    }
</style>
