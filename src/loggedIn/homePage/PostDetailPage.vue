<template>
  <div>
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
    <div v-if="!postedByCurrentUser">
      <h5>Your conversation with {{ postersName }}</h5>
      <mail-thread-container 
        :connect-or-cancel-allowed="'disabled'"
        :mail-items="mailItems"
        :my-avatar="myAvatar"
        :other-avatar="postersAvatar"
        @sendMail="sendMail($ev)"/>
    </div>
    <div v-else>
      <h5>This is your post</h5>
      <p>You cannot start a conversation about your own post - somebody needs
        to start a conversation with you.</p>
      <br>
      <p>To view conversations from others about your posts, view <router-link :to="{name: 'mailbox'}" id="linkToMailbox">your mailbox</router-link></p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MailThreadContainer from './shared/MailThreadContainer.vue'

// This probably exists, just can't find it right now
function stringDotFormat (joiner, strings) {
  return strings.length === 1
        ? strings[0]
        : strings.reduce((acc, nxt) => acc + joiner + nxt, '')
}

const REMOTE_LOCATION = 'REMOTE'

export default {
  data () {
    return { 
      mailContent: '',
      myAvatar: {altText: 'You'}
    }
  },
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
    postersName () {
      // This is incorrect, but just a placeholder for the correct implementation
      return this.post.postedBy
    },
    postersAvatar () {
      return {altText: this.postersName}
    },
    postedByCurrentUser () {
      return this.post.postedBy === this.username
    },
    ...mapGetters({
      'storedPost': 'loggedin/postdetails/post',
      favouritePostIds: 'loggedin/favouritePostIds',
      'username': 'username',
      mailItems: 'loggedin/postthread/mailItems'})
  },
  created () {
    this.$store.dispatch('loggedin/postdetails/getPost', this.postId)
    const mailThreadQuery = {
      postId: this.postId,
      threadAuthor: this.username,
      sortField: 'sent',
      sortOrderAsc: true
    }
    this.$store.dispatch('loggedin/postthread/getMailThread', mailThreadQuery)
  },
  methods: {
    onDeleted () {
      this.$router.push({name: 'latestPosts'})
    },
    deletePost () {
      if (confirm('You are about to delete this post - are you sure?')) {
        this.$store.dispatch('loggedin/postdetails/deletePost', {postId: this.postId, successCallback: this.onDeleted})
      }
    },
    toggleFavourite () {
      const storeAction = !this.isFavourited ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + storeAction, this.postId)
    },
    sendMail (mailText) {
      console.log("sendMail called")
      this.$store.dispatch('loggedin/postthread/newMail', {postId: this.postId, threadAuthor: this.username, text: mailText})
    }
  },
  components: {
    'mail-thread-container': MailThreadContainer
  }
}
</script>

<style>
</style>
