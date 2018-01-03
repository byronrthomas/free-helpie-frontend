<template>
  <div style="background-color: #fffafa">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <p style="color:rgb(235, 113, 180); text-align: center" class="h2">
          Posted by: 
          <a href="#" style="color:rgb(235, 113, 180)" @click.prevent="$emit('goToPostUser')">{{postersName}}</a>
        </p>
      </div>
    </div>
    <form-segment header-text="What do you need">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" disabled="true" v-model="post.title" class="form-control">
        </div>
        <div class="form-group">
          <label>Give some more details</label><br>
          <textarea disabled="true" v-model="post.description"
          rows="5"
          class="form-control"/>
        </div>      
    </form-segment>
    <form-segment header-text="Location">
      <label>Where do you need help?</label>
      <div class="form-group">
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="remoteLocation"
                    value="true"
                    disabled="true" v-model="post.remote">Can help be given remotely?
        </label>
      </div>
      <div class="form-group">
        <label>At specific locations:</label>
        <multi-select-display :selected-items="post.locations"/>
      </div>
    </form-segment>
    <form-segment header-text="Interests &amp; skills"> 
        <div class="form-group">
          <label>People might want to help if they are interested in:</label>
          <multi-select-display :selected-items="post.interests"/>
        </div>
        <div class="form-group">
          <label>Skills that your helpers will need:</label>
          <multi-select-display :selected-items="post.skills"/>
        </div>
    </form-segment>
    <form-segment header-text="Time required">
      <label>How much time is required?</label>
      <div class="form-group">
        <select 
          id="timeAmount" 
          disabled="true" v-model="post.timings.regularAmount.unit">
            <option disabled value=""></option>
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
          disabled="true" v-model="post.timings.regularAmount.frequency">
            <option disabled value=""></option>
            <option>Week</option>
            <option>Month</option>
        </select>          
      </div>
      <div class="form-group">
        <label class="checkbox">What slots can people help with?</label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekday"
                    value="Weekday"
                    disabled="true" v-model="post.timings.slots"> Weekday
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekend"
                    value="Weekend"
                    disabled="true" v-model="post.timings.slots"> Weekend
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="evening"
                    value="Evening"
                    disabled="true" v-model="post.timings.slots"> Evening
        </label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="daytime"
                    value="Daytime"
                    disabled="true" v-model="post.timings.slots"> Daytime
        </label>
      </div>       
    </form-segment>
  </div>
</template>

<script>
import MultiselectDisplay from '../../sharedComponents/MultiselectDisplay.vue'
import FormSegment from '../../sharedComponents/FormSegment.vue'

function clonePost (input) {
  const result = {...input}
  result.locations = [...input.locations]
  result.skills = [...input.skills]
  result.interests = [...input.interests]
  return result
}

export default {
  props: {
    post: {
      type: Object, 
      required: true
    },
    postersName: {
      type: String,
      required: true
    }
  },
  components: {
    'multi-select-display': MultiselectDisplay,
    'form-segment': FormSegment
  }
}
</script>

<style>
</style>
