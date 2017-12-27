<template>
  <div class="post-summary-container">
    <div class="row" style="margin-right: 0px">
      <div class="col-xs-3">
        <a href="unknown" @click.prevent="alertNotImplemented">{{ userDisplay }}</a>
      </div>
      <div class="col-xs-3">
        <a href="unknown" @click.prevent="$emit('viewPost')">
          {{ post.title }}
        </a>
      </div>
      <div class="col-xs-3">{{ formattedSkills }}</div>
      <div class="col-xs-2">{{ post.location }}</div>
      <div class="col-xs-1">
        <button class="btn btn-default save-button" @click="$emit('savePost')">
          <img src='../../../assets/starInactive.png' alt="Unsave" :hidden="isSaved"  style="width=14px;height=14px" width="36px" height="36px">
          <img src='../../../assets/starActive.png' alt="Save" style="width=14px;height=14px" :hidden="!isSaved"  width="36px" height="36px">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['post', 'isSaved', 'userDisplay'],
  computed: {
    formattedSkills () {
      return this.post.skills.length === 1
        ? this.post.skills[0]
        : this.post.skills.reduce((acc, nxt) => acc + ', ' + nxt, '')
    },
    saveOrUnsave () {
      return this.isSaved ? 'Unsave' : 'Save'
    },
    starImagePath () {
      return '../../assets/' + (this.isSaved ? 'starActive.png' : 'starInactive.png')
    }
  },
  methods: {
    alertNotImplemented () {
      alert('Don\'t know where this link would go to yet? User profile?')
    }
  }
}
</script>

<style>
  .post-summary-container {
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
