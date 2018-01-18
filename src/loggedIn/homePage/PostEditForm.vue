<template>
  <div style="background-color: #fffafa">
    <div class="row">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
        <h4 style="color:rgb(235, 113, 180); text-align: center">{{ createOrUpdate }} post</h4>
      </div>
    </div>
    <form-segment :header-text="text.formTitle">
      <alerting-slot :alert-text="text.title.alert" :alerting="titleMissing">
        <div class="form-group">
          <label for="title">{{text.title.label}}</label>
          <input type="text" id="title" v-model="post.title" class="form-control">
        </div>
      </alerting-slot>
      <alerting-slot :alert-text="text.description.alert" :alerting="descriptionMissing">
        <div class="form-group">
          <label>{{text.description.label}}</label><br>
          <textarea v-model="post.description" :placeholder="text.description.placeholder"
          rows="5"
          class="form-control"/>
        </div>      
      </alerting-slot>
    </form-segment>
    <form-segment header-text="Location">
      <alerting-slot :alert-text="text.locations.alert" :alerting="locationsMissing">
        <label>{{text.locations.label}}</label>
        <div class="form-group">
          <label class="checkbox-inline">
              <input
                      type="checkbox"
                      id="remoteLocation"
                      value="true"
                      v-model="post.remote">Remote (over the phone / internet)
          </label>
        </div>
        <div class="form-group">
          <label>At specific locations:</label>
          <multi-select-fixed-options v-model="post.locations" :possibleOptions="possibleLocations"/>
        </div>
      </alerting-slot>
    </form-segment>
    <form-segment header-text="Interests &amp; skills">
      <alerting-slot :alert-text="text.skillsAndInterests.alert" :alerting="skillsAndInterestsMissing">
        <div class="form-group">
          <label>{{text.skillsAndInterests.interestsLabel}}</label>
          <multi-select-fixed-options v-model="post.interests" :possibleOptions="possibleInterests"/>
        </div>
        <div class="form-group">
          <label>{{text.skillsAndInterests.skillDetailLabel}}</label>
          <multi-select-fixed-options v-model="post.skills" :possibleOptions="possibleSkills"/>
        </div>
      </alerting-slot>    
    </form-segment>
    <form-segment header-text="Time required">
      <alerting-slot :alert-text="text.timeAmount.alert" :alerting="regularTimeMissing">
        <label>{{text.timeAmount.label}}</label>
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
      </alerting-slot>
      <alerting-slot :alert-text="text.timeslots.alert" :alerting="timeslotsMissing">
        <div class="form-group">
          <label class="checkbox">{{text.timeslots.label}}</label>
          <label class="checkbox-inline">
              <input
                      type="checkbox"
                      id="weekday"
                      value="Weekday"
                      v-model="post.timings.slots"> Weekday
          </label>
          <label  class="checkbox-inline">
              <input
                      type="checkbox"
                      id="weekend"
                      value="Weekend"
                      v-model="post.timings.slots"> Weekend
          </label>
          <label  class="checkbox-inline">
              <input
                      type="checkbox"
                      id="evening"
                      value="Evening"
                      v-model="post.timings.slots"> Evening
          </label>
          <label class="checkbox-inline">
              <input
                      type="checkbox"
                      id="daytime"
                      value="Daytime"
                      v-model="post.timings.slots"> Daytime
          </label>
        </div>             
      </alerting-slot>
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
import SlotWithReactiveAlert from '../../sharedComponents/SlotWithReactiveAlert.vue'
import { isValidPostType } from './postTypes'
import { getDescriptionsForPostType } from './postFormDescriptions'

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
          Array.isArray(value.timings.slots) &&
          isValidPostType(value.postType)
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
      text: getDescriptionsForPostType(this.initialPostData.postType),
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
    'form-segment': FormSegment,
    'alerting-slot': SlotWithReactiveAlert
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
