<template>
  <div>
    <button class="btn btn-primary" @click="toggleFavourite">{{ toggleSaveText }}</button>
    <router-link tag="button" :to="{name: 'editPost', params: {postId: postKey}}" v-if="ableToEdit" class="btn btn-primary">Edit</router-link>
    <button v-if="ableToEdit" class="btn btn-primary" @click="deletePost">Delete</button>
    <h3>{{ post.title }}</h3>
    <p><strong>Requested by</strong> {{ postersName }} </p>
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
        :connect-or-cancel-allowed="cancelConnectAllowed"
        :mail-items="mailItems"
        :my-avatar="myAvatar"
        :other-avatar="postersAvatar"
        :user-id="userId"
        @sendMail="sendMail($event)"
        @readUpToTimestamp="markAsRead"
        @makeConnection="makeConnection"
        @cancelConnection="cancelConnection"/>
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
      myAvatar: {altText: 'You'}
    }
  },
  props: {
    postId: String,
    validator (value) {
      return !isNaN(parseInt(value))
    }
  },
  computed: {
    postKey () {
      return parseInt(this.postId)
    },
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
    cancelConnectAllowed () {
      return this.mailItems.length > 0
        ? 'connectAllowed'
        : 'disabled'
    },
    isFavourited () {
      return this.favouritePostIds.includes(this.postKey)
    },
    toggleSaveText () {
      return this.isFavourited ? 'Unfavourite' : 'Favourite'
    },
    postersName () {
      const userData = this.profileInfo[this.post.postedBy] || {name: '[unknown]'}
      return this.postedByCurrentUser
        ? `You (${userData.name})`
        : userData.name
    },
    postersAvatar () {
      return {altText: this.postersName}
    },
    postedByCurrentUser () {
      return this.post.postedBy === this.userId
    },
    ...mapGetters({
      'storedPost': 'loggedin/postdetails/post',
      'profileInfo': 'loggedin/postdetails/profileInfo',
      favouritePostIds: 'loggedin/favouritePostIds',
      'userId': 'userId',
      mailItems: 'loggedin/postthread/mailItems'})
  },
  created () {
    this.$store.dispatch('loggedin/postdetails/getPost', this.postKey)
    const mailThreadQuery = {
      relatedToPostId: this.postKey,
      threadAuthor: this.userId,
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
        this.$store.dispatch('loggedin/postdetails/deletePost', {postId: this.postKey, successCallback: this.onDeleted})
      }
    },
    toggleFavourite () {
      const storeAction = !this.isFavourited ? 'favouritePost' : 'unfavouritePost'
      this.$store.dispatch('loggedin/' + storeAction, this.postKey)
    },
    sendMail (mailText) {
      this.$store.dispatch('loggedin/postthread/newMail', {relatedToPostId: this.postKey, threadAuthor: this.userId, mailText: mailText})
    },
    markAsRead (latestReadTimestamp) {
      const reqData = {
        timestampReadUpTo: latestReadTimestamp,
        relatedToPostId: this.postKey,
        threadAuthor: this.userId
      }
      this.$store.dispatch('loggedin/postthread/markThreadAsRead', reqData)
    },
    makeConnection () {
      const message = `You have asked to connect with ${this.postersName} - normally this ` +
        'would mean that they get an invite to connect and can choose to connect with you (see' +
        ' Your Connections for more info) to share contact details. This is not yet implemented.'
      alert(message)
    },
    cancelConnection () {
      const message = `You have asked to cancel your connection with ${this.postersName} - normally this` +
        ' would mean that your invite to connect is withdrawn and you will not be sharing' +
        ' contact details any more. This is not yet implemented.'
      alert(message)
    }
  },
  components: {
    'mail-thread-container': MailThreadContainer
  }
}
</script>

<style>
</style>
