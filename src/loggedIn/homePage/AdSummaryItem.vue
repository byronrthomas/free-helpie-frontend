<template>
  <div class="ad-summary-container">
    <div class="row">
      <div class="col-xs-3">
        <a href="unknown">{{ ad.postedBy }}</a>
      </div>
      <div class="col-xs-3">{{ ad.title }} </div>
      <div class="col-xs-3">{{ formattedSkills }}</div>
      <div class="col-xs-3">{{ ad.location }}</div>
    </div>
    <div class="row">
      <div class="col-xs-3 col-xs-offset-6">
        <button class="btn btn-primary" @click="$emit('viewPost', ad.id)">View</button>
      </div>
      <div class="col-xs-3">
        <button class="btn btn-primary" @click="$emit('savePost', ad.id)">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['ad'],
  computed: {
    formattedSkills () {
      return this.ad.skills.length === 1
        ? this.ad.skills[0] 
        : this.ad.skills.reduce( (acc, nxt) => acc + ", " + nxt, '')
    }
  }
}
</script>

<style>
</style>
