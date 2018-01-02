<template>
  <div style="background-color: #fffafa">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h2 style="color:rgb(235, 113, 180); text-align: center">{{profileData.personalInfo.name}}</h2>
      </div>
    </div>
    <form-segment header-text="Contact details">
      <div class="alert alert-warning">
        You are not currently connected with {{profileData.personalInfo.name}} - so you cannot see their
        contact details. You can invite them to connect once you have started a conversation about one of
        their posts (or they have started a conversation with you). See Your Connections for more info.
      </div>
    </form-segment>
    <form-segment header-text="Personal Info">
        <div class="form-group">
          <label for="photo">Photo - PLACEHOLDER</label>
          <input type="text" id="photo" disabled="true" v-model="profileData.personalInfo.photo" class="form-control">
        </div>
    </form-segment>
    <form-segment header-text="Location">
      <label>Available at:</label>
      <div class="form-group">
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="locationHome"
                    value="LocationHome"
                    disabled="true" v-model="profileData.locationTypes"> From your home
        </label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="locationAway"
                    value="LocationAway"
                    disabled="true" v-model="profileData.locationTypes"> On location
        </label>
      </div>
      <div class="form-group">
        <label>Locations:</label>
        <multi-select-display :selected-items="profileData.locations"/>
      </div>
    </form-segment>
    <form-segment header-text="Experience &amp; skills">
        <div class="form-group">
          <label>Interests:</label>
          <multi-select-display :selected-items="profileData.interests" />
        </div>
        <div class="form-group">
          <label>Skills:</label>
          <multi-select-display :selected-items="profileData.skills" />
        </div>
        <div class="form-group">
          <label>Profile:</label><br>
          <textarea disabled="true" v-model="profileData.description"
          rows="5"
          class="form-control"/>
        </div>        
    </form-segment>
    <form-segment header-text="Time available">
      <label>Hours available:</label>
      <div class="form-group">
        <select 
          id="timeAmount" 
          disabled="true" v-model="profileData.timings.regularAmount.unit">
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
          disabled="true" v-model="profileData.timings.regularAmount.frequency">
            <option>Week</option>
            <option>Month</option>
        </select>          
      </div>
      <div class="form-group">
        <label class="checkbox">Available at:</label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekday"
                    value="Weekday"
                    disabled="true" v-model="profileData.timings.slots"> Weekday
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekend"
                    value="Weekend"
                    disabled="true" v-model="profileData.timings.slots"> Weekend
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="evening"
                    value="Evening"
                    disabled="true" v-model="profileData.timings.slots"> Evening
        </label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="daytime"
                    value="Daytime"
                    disabled="true" v-model="profileData.timings.slots"> Daytime
        </label>
      </div>       
    </form-segment>
  </div>
</template>

<script>
import MultiselectDisplay from '../../sharedComponents/MultiselectDisplay.vue'
import FormSegment from '../../sharedComponents/FormSegment.vue'

export default {
  props: {
    profileData: Object
  },
  components: {
    'multi-select-display': MultiselectDisplay,
    'form-segment': FormSegment
  }
}
</script>

<style>
</style>
