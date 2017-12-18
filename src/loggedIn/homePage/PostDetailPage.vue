<template>
  <div>
    <button class="btn btn-primary">Message</button>
    <button class="btn btn-primary" @click="toggleFavourite">{{ toggleSaveText }}</button>
    <router-link tag="button" :to="{name: 'editPost', params: {postId: postId}}" v-if="ableToEdit" class="btn btn-primary">Edit</router-link>
    <button v-if="ableToEdit" class="btn btn-primary" @click="deletePost">Delete</button>
    <h3>{{ post.title }}</h3>
    <p><strong>Requested by</strong> {{ post.postedBy }} </p>
    <br>
    <p><strong>Location:</strong> {{ formattedLocation }}</p>
    <br>
    <p>{{ formattedSkills }} {{ formattedInterests }}</p>
    <br>
    <h5>Description</h5>
    <div> {{ post.description }}</div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

// This probably exists, just can't find it right now
function stringDotFormat (joiner, strings) {
  return strings.length === 1
        ? strings[0]
        : strings.reduce((acc, nxt) => acc + joiner + nxt, '')
}

const REMOTE_LOCATION = 'REMOTE'

export default {
  props: ['postId'],
  computed: {
    post () {
      if (this.storedPost) {
        return this.storedPost
      } else {
        return {
          title: '',
          postedBy: '',
          description: '',
          skills: [],
          interests: [],
          location: '',
          remote: false,
          id: -1}
      }
    },
    formattedSkills () {
      console.log('post = ')
      console.log(this.post)
      return stringDotFormat(', ', this.post.skills)
    },
    formattedInterests () {
      return stringDotFormat(', ', this.post.interests)
    },
    formattedLocation () {
      if (this.post.location) {
        const remoteSuffix = this.post.remote ? ' / ' + REMOTE_LOCATION : ''
        return this.post.location + remoteSuffix
      }
      return REMOTE_LOCATION
    },
    ableToEdit () {
      // TODO: this should really be based on asking userAuth (is userXXX allowed to edit postYYY)
      return this.post.postedBy === this.username
    },
    isFavourited () {
      return this.favouritePostIds.includes(this.postId)
    },
    toggleSaveText () {
      return this.isFavourited ? 'Unfavourite' : 'Favourite'
    },
    ...mapGetters({
      'storedPost': 'loggedin/postdetails/post',
      favouritePostIds: 'loggedin/favouritePostIds', 
      'username': 'username'})
  },
  created () {
    this.$store.dispatch('loggedin/postdetails/getPost', this.postId)
  },
  methods : {
    onDeleted () {
      this.$router.push({name: 'latestPosts'});
    },
    deletePost () {
      if (confirm('You are about to delete this post - are you sure?')) {
        this.$store.dispatch('loggedin/postdetails/deletePost', {postId: this.postId, successCallback: this.onDeleted})
      }
    },
    toggleFavourite () {
      const storeAction = !this.isFavourited ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + storeAction, this.postId)
    }
  }
}
</script>

<style>
</style>
