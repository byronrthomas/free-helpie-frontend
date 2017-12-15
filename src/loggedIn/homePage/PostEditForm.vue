<template>
  <div style="background-color: #fffafa">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h4 style="color:rgb(235, 113, 180); text-align: center">{{ createOrUpdate }} post</h4>
      </div>
    </div>
    <form-segment header-text="What do you need">
        <div :class="alertClass" role="alert" v-if="titleMissing">
          <p>Give your post a title that will help them understand the outline of what you need</p>
        </div>
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" v-model="post.title" class="form-control">
        </div>
        <div :class="alertClass" role="alert" v-if="descriptionMissing">
          <p>Be descriptive about the details of what you need</p>
        </div>
        <div class="form-group">
          <label>Give some more details</label><br>
          <textarea v-model="post.description" :placeholder="descriptionSuggestion"
          rows="5"
          class="form-control"/>
        </div>      
    </form-segment>
    <form-segment header-text="Location">
      <div :class="alertClass" role="alert" v-if="locationsMissing">
        <p>Please let your helpers know where they need to be - either add specific locations,
          or select remote, or both
        </p>
      </div>
      <label>Where do you need help?</label>
      <div class="form-group">
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="remoteLocation"
                    value="true"
                    v-model="post.remote">Can help be given remotely?
        </label>
      </div>
      <div class="form-group">
        <label>At specific locations:</label>
        <multi-select-fixed-options v-model="post.locations" :possibleOptions="possibleLocations"/>
      </div>
    </form-segment>
    <form-segment header-text="Interests &amp; skills">
        <div :class="alertClass" role="alert" v-if="skillsAndInterestsMissing">
          <p>Please add some interests or skills - the more you add, the easier it will be hard for helpers to match you</p>
        </div>      
        <div class="form-group">
          <label>People might want to help if they are interested in:</label>
          <multi-select-fixed-options v-model="post.interests" :possibleOptions="possibleInterests"/>
        </div>
        <div class="form-group">
          <label>Skills that your helpers will need:</label>
          <multi-select-fixed-options v-model="post.skills" :possibleOptions="possibleSkills"/>
        </div>
    </form-segment>
    <form-segment header-text="Time required">
      <div :class="alertClass" role="alert" v-if="regularTimeMissing">
        <p>Please fill this out - it's important for your helpers to be able to match with you
          and plan their time</p>
      </div>
      <label>How much time is required?</label>
      <div class="form-group">
        <select 
          id="timeAmount" 
          v-model="post.timings.regularAmount.unit">
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
          v-model="post.timings.regularAmount.frequency">
            <option disabled value=""></option>
            <option>Week</option>
            <option>Month</option>
        </select>          
      </div>
      <div class="form-group">
        <div :class="alertClass" role="alert" v-if="timeslotsMissing">
          <p>Please fill this out - helpers need to know what slots you need them</p>
        </div>
        <label class="checkbox">What slots can people help with?</label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekday"
                    value="TimeslotWeekday"
                    v-model="post.timings.slots"> Weekday
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="weekend"
                    value="TimeslotWeekend"
                    v-model="post.timings.slots"> Weekend
        </label>
        <label  class="checkbox-inline">
            <input
                    type="checkbox"
                    id="evening"
                    value="TimeslotEvening"
                    v-model="post.timings.slots"> Evening
        </label>
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="daytime"
                    value="TimeslotDaytime"
                    v-model="post.timings.slots"> Daytime
        </label>
      </div>       
    </form-segment>
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2">
        <div class="row">
          <div class="col-xs-10 col-xs-offset-1">
            <div :class="alertClass" role="alert" v-if="!formContentsValid">
              <p>There are still some missing items, described above, you need to fill these out before you can submit</p>
            </div>
            <p v-if="lastServerError">{{ lastServerError }}</p>    
            <button 
              class="btn btn-primary" 
              style="width:100%; text-align:center"
              id="submitButton"
              :disabled="!formContentsValid"
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
import MultiselectFixedOptions from '../../sharedComponents/MultiSelectFixedOptions.vue'
import FormSegment from '../../sharedComponents/FormSegment.vue'

const POST_DESCRIPTION_OUTLINE = `Give the details about what you need, things to think about:
- Telling us a bit about the background of why you need help
- Give plenty of detail about the activity
- Dig down into details of any specialist skills / experience needed
- Tell us what kind of person you would like to help out
- Be nice!`

function clonePost (input) {
  const result = {...input}
  result.locations = [...input.locations]
  result.skills = [...input.skills]
  result.interests = [...input.interests]
  return result
}

export default {
  props: {
    'initialPostData': {
      validator (value) {
        return Array.isArray(value.skills) &&
          Array.isArray(value.interests) &&
          Array.isArray(value.locations) &&
          (typeof value.title === 'string') &&
          (typeof value.description === 'string') &&
          (typeof value.remote === 'boolean') &&
          value.postedBy &&
          value.timings &&
          value.timings.regularAmount &&
          (typeof value.timings.regularAmount.unit === 'string') &&
          (typeof value.timings.regularAmount.frequency === 'string') &&
          Array.isArray(value.timings.slots)
      },
      required: true
    },
    'createOrUpdate': {
      type: String,
      validator (value) {
        return ['Create', 'Update'].includes(value)
      },
      required: true
    },
    'lastServerError': {
      type: String,
      default: ''
    },
    'possibleSkills': {
      type: Array,
      required: true
    },
    'possibleLocations': {
      type: Array,
      required: true
    },
    'possibleInterests': {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      alertClass: {
        'alert': true,
        'alert-danger': true,
        'strong': true
      },
      descriptionSuggestion: POST_DESCRIPTION_OUTLINE,
      post: clonePost(this.initialPostData)
    }
  },
  computed: {
    skillsAndInterestsMissing () {
      return this.post.skills.length === 0 && this.post.interests.length === 0
    },
    locationsMissing () {
      return this.post.locations.length === 0 && !this.post.remote
    },
    regularTimeMissing () {
      return !this.post.timings.regularAmount.unit || !this.post.timings.regularAmount.frequency
    },
    timeslotsMissing () {
      return this.post.timings.slots.length === 0
    },
    titleMissing () {
      return !this.post.title
    },
    descriptionMissing () {
      return !this.post.description
    },
    formContentsValid () {
      return !(this.skillsAndInterestsMissing ||
        this.locationsMissing ||
        this.regularTimeMissing ||
        this.timeslotsMissing ||
        this.titleMissing ||
        this.descriptionMissing)
    },
    buttonText () {
      return this.createOrUpdate === 'Create' ? 'Post' : 'Save changes'
    }
  },
  components: {
    'multi-select-fixed-options': MultiselectFixedOptions,
    'form-segment': FormSegment
  },
  methods: {
    submitForm () {
      console.log(this.post)
      this.$emit('submitForm', this.post)
    }
  }
}
</script>

<style>
</style>
