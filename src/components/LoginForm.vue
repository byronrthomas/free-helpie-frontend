<template>
  <div class="container">
    <div class="row">
      <!-- <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset 3"> -->
      <div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-md-3 col-md-offset-4">
        <h2>Login</h2>
        <div class="form-group">
          <label for="Email">Email</label>
          <input type="email" v-model="username" class="form-control">
        </div>
        <div class="form-group">
          <label for="Password">Password</label>
          <input type="password" v-model="password" class="form-control">
        </div>
        <button class="btn btn-primary">Login</button>        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return { username: '', password: '' }
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
