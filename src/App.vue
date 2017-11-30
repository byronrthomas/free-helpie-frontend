<template>
  <app-login-form/>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
export default {
  name: 'app',
  components: {
    'app-login-form': LoginForm
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
