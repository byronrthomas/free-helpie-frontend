<template>
  <div style="background-color: #fffafa">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h4 style="color:rgb(235, 113, 180); text-align: center">{{ createOrUpdate }} your profile</h4>
      </div>
    </div>
    <form-segment header-text="Personal Info">
        <div class="form-group">
          <label for="photo">Photo - PLACEHOLDER</label>
          <input type="text" id="photo" disabled="true" v-model="profileData.personalInfo.photo" class="form-control">
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="profileData.personalInfo.name" class="form-control">
        </div>
    </form-segment>
    <form-segment header-text="Location">
      <label>Where are you available?</label>
      <div class="form-group">
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="locationHome"
                    value="LocationHome"
                    v-model="profileData.locationTypes"> From your home
        </label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="locationAway"
                    value="LocationAway"
                    v-model="profileData.locationTypes"> On location
        </label>
      </div>
      <div class="form-group">
        <label>Where can you help?</label>
        <multi-select-fixed-options v-model="profileData.locations" :possibleOptions="possibleLocations"/>
      </div>
    </form-segment>
    <form-segment header-text="Experience &amp; skills">
        <div class="form-group">
          <label>What can you help with?</label>
          <multi-select-fixed-options v-model="profileData.interests" :possibleOptions="possibleInterests"/>
        </div>
        <div class="form-group">
          <label>What skills can you offer?</label>
          <multi-select-fixed-options v-model="profileData.skills" :possibleOptions="possibleSkills"/>
        </div>
        <div class="form-group">
          <label>Please tell us a bit about yourself:</label><br>
          <textarea v-model="profileData.description" :placeholder="descriptionSuggestion"
          rows="5"
          class="form-control"/>
        </div>        
    </form-segment>
    <form-segment header-text="Time available">
      <label>How many hours can you put in?</label>
      <div class="form-group">
        <select 
          id="timeAmount" 
          v-model="profileData.timings.regularAmount.unit">
            <option>1hr</option>
            <option>2hr</option>
            <option>3hr</option>
            <option>4hr</option>
            <option>1day</option>
            <option>2days</option>
            <option>3days</option>
        </select>
        <span>per</span>
        <select 
          id="timeFrequency" 
          v-model="profileData.timings.regularAmount.frequency">
            <option>Week</option>
            <option>Month</option>
        </select>          
      </div>
      <div class="form-group">
        <label class="checkbox">When are you available?</label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekday"
                    value="Weekday"
                    v-model="profileData.timings.slots"> Weekday
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekend"
                    value="Weekend"
                    v-model="profileData.timings.slots"> Weekend
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="evening"
                    value="Evening"
                    v-model="profileData.timings.slots"> Evening
        </label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="daytime"
                    value="Daytime"
                    v-model="profileData.timings.slots"> Daytime
        </label>
      </div>       
    </form-segment>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2">
        <div class="row">
          <div class="col-xs-10 col-xs-offset-1">
            <div class="checkbox">
              <label for="name">
              <input type="checkbox" id="tsAndCs" v-model="profileData.agreedToTsAndCs" > I agree to the terms &amp; conditions
              </label>
            </div>
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
</template>

<script>
import {mapGetters} from 'vuex'
import MultiselectFixedOptions from '../sharedComponents/MultiSelectFixedOptions.vue'
import FormSegment from '../sharedComponents/FormSegment.vue'

function makeEmptyFormData () {
  return {
    personalInfo: {
      name: '',
      photo: null
    },
    locations: [],
    interests: [],
    skills: [],
    description: '',
    locationTypes: [],
    timings: {
      regularAmount: {
        unit: '1hr',
        frequency: 'Week'},
      slots: []
    },
    agreedToTsAndCs: false
  }
}

export default {
  data () {
    const initialFormValue = this.$store.getters['loggedin/userProfile']
    if (initialFormValue) {
      return {
        createOrUpdate: 'Update',
        profileData: {
          personalInfo: initialFormValue.personalInfo,
          locations: initialFormValue.locations,
          locationTypes: initialFormValue.locationTypes,
          interests: initialFormValue.interests,
          skills: initialFormValue.skills,
          description: initialFormValue.description,
          timings: initialFormValue.timings,
          agreedToTsAndCs: initialFormValue.agreedToTsAndCs
        }
      }
    }
    return {
      createOrUpdate: 'Create',
      profileData: makeEmptyFormData()}
  },
  computed: {
    ...mapGetters({
      'lastServerError': 'lastServerError',
      'possibleLocations': 'loggedin/possibleLocations',
      'possibleInterests': 'loggedin/possibleInterests',
      'possibleSkills': 'loggedin/possibleSkills',
      'descriptionSuggestion': 'loggedin/profileTextSuggestion'})
  },
  components: {
    'multi-select-fixed-options': MultiselectFixedOptions,
    'form-segment': FormSegment
  },
  methods: {
    submitForm () {
      console.log(this.profileData)
      const dataToPost = {...this.profileData}
      this.$store.dispatch('loggedin/updateUserProfile', dataToPost)
    }
  }
}
</script>

<style>
</style>
