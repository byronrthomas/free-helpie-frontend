<template>
  <div class="post-summary-container">
    <div class="row" style="margin-right: 0px">
      <div class="col-xs-3">
        <a href="unknown" @click.prevent="$emit('viewUser')">{{ userDisplay }}</a>
      </div>
      <div class="col-xs-3">
        <a href="unknown" @click.prevent="$emit('viewPost')">
          {{ post.title }}
        </a>
      </div>
      <div class="col-xs-3">{{ formattedSkills }}</div>
      <div class="col-xs-2">{{ post.location }}</div>
      <div class="col-xs-1">
        <button class="btn btn-lg btn-default save-button" @click="$emit('savePost')">
          <span class="glyphicon glyphicon-star" aria-hidden="true" v-if="isSaved"></span>
          <span class="glyphicon glyphicon-star-empty" aria-hidden="true" v-else></span>
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
