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
          <input type="text" id="photo" disabled="true" v-model="personalInfo.photo" class="form-control">
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="personalInfo.name" class="form-control">
        </div>
    </form-segment>
    <form-segment header-text="Location">
      <div class="form-group">
        <label>Where are you available?</label>
        <label for="locationHome">
            <input
                    type="checkbox"
                    id="locationHome"
                    value="LocationHome"
                    v-model="helperLocationTypes"> From your home
        </label>
        <label for="locationAway">
            <input
                    type="checkbox"
                    id="locationAway"
                    value="LocationAway"
                    v-model="helperLocationTypes"> On location
        </label>
      </div>
      <div class="form-group">
        <label>Where can you help?</label>
        <multi-select-fixed-options v-model="helperLocations" :possibleOptions="possibleLocations"/>
      </div>
    </form-segment>
    <form-segment header-text="Experience &amp; skills">
        <div class="form-group">
          <label>What can you help with?</label>
          <multi-select-fixed-options v-model="helperCategories" :possibleOptions="possibleCategories"/>
        </div>
        <div class="form-group">
          <label>What skills can you offer?</label>
          <multi-select-fixed-options v-model="helperSkills" :possibleOptions="possibleSkills"/>
        </div>
        <div class="form-group">
          <label>Please tell us a bit about yourself:</label><br>
          <textarea v-model="helperDescription" :placeholder="descriptionSuggestion"
          rows="5"
          class="form-control"/>
        </div>        
    </form-segment>
    <form-segment header-text="Time available">
      <div class="form-group">
        <label>How many hours can you put in?</label>
        <select 
          id="timeAmount" 
          v-model="helperTimings.regularAmount.unit">
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
          v-model="helperTimings.regularAmount.frequency">
            <option>Week</option>
            <option>Month</option>
        </select>          
      </div>
      <div class="form-group">
        <label>When are you available?</label>
        <div class="checkbox-inline">
          <label>
              <input
                      type="checkbox"
                      id="weekday"
                      value="TimeslotWeekday"
                      v-model="helperTimings.slots"> Weekday
          </label>
        </div>
        <div class="checkbox-inline">
          <label>
              <input
                      type="checkbox"
                      id="weekend"
                      value="TimeslotWeekend"
                      v-model="helperTimings.slots"> Weekend
          </label>
        </div>
        <div class="checkbox-inline">
          <label>
              <input
                      type="checkbox"
                      id="evening"
                      value="TimeslotEvening"
                      v-model="helperTimings.slots"> Evening
          </label>
        </div>
        <div class="checkbox-inline">
          <label>
              <input
                      type="checkbox"
                      id="daytime"
                      value="TimeslotDaytime"
                      v-model="helperTimings.slots"> Daytime
          </label>
        </div>
      </div>       
    </form-segment>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2">
        <br>
        <div class="checkbox">
          <label for="name">
          <input type="checkbox" id="tsAndCs" v-model="helperAgreedToTsAndCs" > I agree to the terms &amp; conditions
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2">
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
import MultiselectFixedOptions from '../sharedComponents/MultiSelectFixedOptions.vue'
import FormSegment from '../sharedComponents/FormSegment.vue'

function makeEmptyFormData() {
  return {
    createOrUpdate: 'Create',
    personalInfo: {
      name: '',
      photo: null
    },
    helperLocations: [],
    helperCategories: [],
    helperSkills: [],
    helperDescription: '',
    helperLocationTypes: [],
    helperTimings: {
      regularAmount: {
        unit: '1hr', 
        frequency: 'Week'},
      slots: []
    },
    helperAgreedToTsAndCs: false
  }
}



export default {
  data () {
    if (this.initialFormValue) {
      return {
        createOrUpdate: 'Update',
        personalInfo: this.initialFormValue.personalInfo,
        helperLocations: this.initialFormValue.helperLocations,
        helperLocationTypes: this.initialFormValue.helperLocationTypes,
        helperCategories: this.initialFormValue.helperCategories,
        helperSkills: this.initialFormValue.helperSkills,
        helperDescription: this.initialFormValue.helperDescription,
        helperTimings: this.initialFormValue.helperTimings,
        helperAgreedToTsAndCs: this.initialFormValue.helperAgreedToTsAndCs}
    } else {
      return makeEmptyFormData()
    }
  },
  props: ['possibleLocations',
          'initialFormValue',
          'possibleCategories',
          'possibleSkills',
          'descriptionSuggestion'],
  computed: {
    ...mapGetters(['lastServerError'])
  },
  components: {
    'multi-select-fixed-options': MultiselectFixedOptions,
    'form-segment': FormSegment
  },
  methods: {
    submitForm() {
      console.log(this.$data)
    }
  }
}
</script>

<style>
</style>
