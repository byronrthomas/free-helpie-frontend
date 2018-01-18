<template>
  <div style="background-color: #fffafa">
    <form-segment :header-text="text.formTitle">
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
      <label>{{text.locations.label}}</label>
      <div class="form-group">
        <label class="checkbox-inline">
            <input
                    type="checkbox"
                    id="remoteLocation"
                    value="true"
                    disabled="true" v-model="post.remote">Remote (over the phone / internet)
        </label>
      </div>
      <div class="form-group">
        <label>At specific locations:</label>
        <multi-select-display :selected-items="post.locations"/>
      </div>
    </form-segment>
    <form-segment header-text="Interests &amp; skills">
        <div class="form-group">
          <label>{{text.skillsAndInterests.interestsLabel}}</label>
          <multi-select-display :selected-items="post.interests"/>
        </div>
        <div class="form-group">
          <label>{{text.skillsAndInterests.skillDetailLabel}}</label>
          <multi-select-display :selected-items="post.skills"/>
        </div>
    </form-segment>
    <form-segment header-text="Timings">
      <label>{{text.timeAmount.label}}</label>
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
        <label class="checkbox">
          {{text.timeslots.label}}
        </label>
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
import { getDescriptionsForPostType } from './postFormDescriptions'

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
  },
  computed: {
    text () {
      return getDescriptionsForPostType(this.post.postType)
    }
  }
}
</script>

<style>
</style>
