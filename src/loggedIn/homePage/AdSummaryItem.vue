<template>
  <div class="ad-summary-container">
    <div class="row">
      <div class="col-xs-3">
        <a href="unknown" @click.prevent="alertNotImplemented">{{ ad.postedBy }}</a>
      </div>
      <div class="col-xs-3">
        <a href="unknown" @click.prevent="$emit('viewPost')">
          {{ ad.title }}
        </a>
      </div>
      <div class="col-xs-3">{{ formattedSkills }}</div>
      <div class="col-xs-2">{{ ad.location }}</div>
      <div class="col-xs-1">
        <button class="btn btn-default save-button" @click="$emit('savePost')">
          <img src='../../assets/starInactive.png' alt="Unsave" :hidden="isSaved"  style="width=14px;height=14px" width="36px" height="36px">
          <img src='../../assets/starActive.png' alt="Save" style="width=14px;height=14px" :hidden="!isSaved"  width="36px" height="36px">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['ad', 'isSaved'],
  computed: {
    formattedSkills () {
      return this.ad.skills.length === 1
        ? this.ad.skills[0] 
        : this.ad.skills.reduce( (acc, nxt) => acc + ", " + nxt, '')
    },
    saveOrUnsave () {
      return this.isSaved ? 'Unsave' : 'Save'
    },
    starImagePath () {
      return '../../assets/' + (this.isSaved ? 'starActive.png' : 'starInactive.png')
    }
  },
  methods: {
    alertNotImplemented() {
      alert("Don't know where this link would go to yet? User profile?")
    }
  }
}
</script>

<style>
  .ad-summary-container {
      background-color: white;
      border-width: 1px 1px 1px 1px; 
      border-color: #ddd; 
      border-style: solid;
      padding: 10px;
      margin-bottom: 10px;
  }
  .save-button {
    margin-top: -10px;
    margin-bottom: -10px;
    border-style: hidden;
  }
</style>
