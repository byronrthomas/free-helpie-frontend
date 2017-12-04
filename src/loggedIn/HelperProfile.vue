<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset 3">
        <h4>{{ createOrUpdate }} your profile</h4>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset 3">
        <h2 style="text-align: center">Personal Info</h2>
        <br>
        <div class="form-group">
          <label for="photo">Photo - PLACEHOLDER</label>
          <input type="text" id="photo" disabled="true" v-model="personalInfo.photo" class="form-control">
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="personalInfo.name" class="form-control">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset 3">
        <h2 style="text-align: center">Location</h2>
        <br>
        <div class="form-group">
          <label>Where are you available?</label>
          <label for="locationHome">
              <input
                      type="checkbox"
                      id="locationHome"
                      value="LocationHome"> From your home
          </label>
          <label for="locationAway">
              <input
                      type="checkbox"
                      id="locationAway"
                      value="LocationAway"> On location
          </label>
        </div>
        <div class="form-group">
          <label>Where can you help?</label>
          <multi-select-fixed-options v-model="availableLocations" :possibleOptions="possibleLocations"/>
        </div>
      </div>
    </div>    
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset 3">
        <p v-if="lastServerError">{{ lastServerError }}</p>    
        <button 
          class="btn btn-primary" 
          @click="submitForm">
          {{ createOrUpdate }}
          </button>        
        <br><br>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    let possibleLocations = [
      'Central London',
      'North London',
      'North-West London',
      'North-East London',
      'South London',
      'South-West London',
      'South-East London',
    ]
    return { 
      userDetails: {username: '', password: ''},
      availableLocations: [] 
      }
  },
  computed: {
    ...mapGetters(['lastServerError'])
  }
}
</script>

<style>
</style>
