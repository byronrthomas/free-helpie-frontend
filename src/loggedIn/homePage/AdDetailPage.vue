<template>
  <div>
    <button class="btn btn-primary">Message</button>
    <button class="btn btn-primary">{{ toggleSaveText }}</button>
    <button v-if="ableToEdit" class="btn btn-primary">Edit</button>
    <button v-if="ableToEdit" class="btn btn-primary">Take down</button>
    <h3>{{ ad.title }}</h3>
    <p><strong>Requested by</strong> {{ ad.postedBy }} </p>
    <br>
    <p><strong>Location:</strong> {{ formattedLocation }}</p>
    <br>
    <p>{{ formattedSkills }} {{ formattedInterests }}</p>
    <br>
    <h5>Description</h5>
    <div> {{ ad.description }}</div>
  </div>
</template>

<script>
// This probably exists, just can't find it right now
function stringDotFormat (joiner, strings) {
  return strings.length === 1
        ? strings[0]
        : strings.reduce((acc, nxt) => acc + joiner + nxt, '')
}

const REMOTE_LOCATION = 'REMOTE'

export default {
  props: ['ad'],
  computed: {
    formattedSkills () {
      return stringDotFormat(', ', this.ad.skills)
    },
    formattedInterests () {
      return stringDotFormat(', ', this.ad.interests)
    },
    formattedLocation () {
      if (this.ad.location) {
        const remoteSuffix = this.ad.remote ? ' / ' + REMOTE_LOCATION : ''
        return this.ad.location + remoteSuffix
      }
      return REMOTE_LOCATION
    },
    ableToEdit () {
      return this.ad.postedBy === 'Jana Swiss'
    },
    toggleSaveText () {
      return this.ad.postedBy === 'John Doe' ? 'Unfavourite' : 'Save'
    }
  }
}
</script>

<style>
</style>
