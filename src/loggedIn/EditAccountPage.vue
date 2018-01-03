<template>
  <div style="background-color: #fffafa" class="row">
    <div class="col-xs-12 col-sm-8 col-sm-offset-2">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <h4 style="color:rgb(235, 113, 180); text-align: center">{{ createOrUpdate }} your acount details</h4>
        </div>
      </div>
      <form-segment header-text="Contact details">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="accountData.email" class="form-control">
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" v-model="accountData.phone" class="form-control">
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" id="address" v-model="accountData.address" class="form-control">
        </div>
        <div class="form-group">
          <label for="dateOfBirth">Date of Birth</label>
          <input type="text" id="dateOfBirth" v-model="accountData.dateOfBirth" class="form-control">
        </div>
      </form-segment>
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-offset-2">
          <div class="row">
            <div class="col-xs-10 col-xs-offset-1">
              <div class="alert alert-danger" v-if="lastServerError">{{ lastServerError }}</div>    
              <button 
                class="btn btn-primary" 
                style="width:100%; text-align:center"
                @click="submitForm">
                {{ createOrUpdate }}
                </button>        
              <br><br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FormSegment from '../sharedComponents/FormSegment.vue'

function makeEmptyFormData () {
  return {
    email: '',
    phone: '',
    address: '',
    dateOfBirth: null
  }
}

export default {
  data () {
    const initialFormValue = this.$store.getters['loggedin/accountDetails']
    if (initialFormValue) {
      return {
        createOrUpdate: 'Update',
        accountData: {
          email: initialFormValue.email,
          phone: initialFormValue.phone,
          address: initialFormValue.address,
          dateOfBirth: initialFormValue.dateOfBirth
        }
      }
    }
    return {
      createOrUpdate: 'Create',
      accountData: makeEmptyFormData()}
  },
  computed: {
    ...mapGetters({
      'lastServerError': 'lastServerError'})
  },
  components: {
    'form-segment': FormSegment
  },
  methods: {
    submitForm () {
      console.log(this.accountData)
      const dataToPost = {...this.accountData}
      this.$store.dispatch('loggedin/updateAccountDetails', dataToPost)
    }
  }
}
</script>

<style>
</style>
