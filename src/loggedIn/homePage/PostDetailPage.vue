<template>
  <div>
    <div class="row">
      <div class="col-xs-12">
        <div class="floatable-bordered">
          <p style="color:rgb(235, 113, 180); text-align: center" class="h2">Posted by:
            <a href="#" style="color:rgb(235, 113, 180)" @click.prevent="gotoPostUser">
              {{postersName}}
            </a>
          </p>
          <br>
        </div>
        <div class="floatable-bordered floatable-bordered-bottom">
          <br>
          <div class="row">
            <div class="col-xs-6 col-xs-offset-3">
              <button class="btn btn-primary btn-block" @click="toggleFavourite">{{ toggleSaveText }}</button>
            </div>
          </div>
          <br>
        </div>
        <br>
      </div>
    </div>
    <post-detail-display 
      :post="post" 
      :posters-name="postersName"
      @goToPostUser="gotoPostUser"/>
    <div v-if="!postedByCurrentUser">
      <mail-thread-container
        :connect-or-cancel-allowed="cancelConnectAllowed"
        :mail-items="mailItems"
        :my-avatar="myAvatar"
        :other-avatar="postersAvatar"
        :user-id="userId"
        :conversation-header-text="conversationHeaderText"
        @sendMail="sendMail($event)"
        @readUpToTimestamp="markAsRead"
        @makeConnection="makeConnection"
        @cancelConnection="cancelConnection"/>
    </div>
    <form-segment v-else :header-text="'NOTE: this is your post'">
      <div class="alert alert-warning">
        <p>You cannot start a conversation about your own post - somebody needs
          to start a conversation with you.</p>
        <br>
        <p>To view conversations from others about your posts, view <router-link :to="{name: 'mailbox'}" id="linkToMailbox">your mailbox</router-link></p>
      </div>
    </form-segment>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MailThreadContainer from './shared/MailThreadContainer.vue'
import PostDetailDisplay from './PostDetailDisplay.vue'
import FormSegment from '../../sharedComponents/FormSegment.vue'

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
    postId: Number
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
          locations: [],
          remote: false,
          timings: {
            regularAmount: {
              unit: '',
              frequency: ''
            },
            slots: []
          },
          id: -1}
      }
    },
    conversationHeaderText () {
      return `Your conversation with ${this.postersName}`
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
      return this.post.postedBy === this.userId
    },
    cancelConnectAllowed () {
      return this.connectionInvitesFromMe.find(invite => invite.otherUser === this.post.postedBy)
        ? 'cancelAllowed'
        : (this.mailItems.length > 0
          ? 'connectAllowed'
          : 'disabled')
    },
    isFavourited () {
      return this.favouritePostIds.includes(this.postKey)
    },
    toggleSaveText () {
      return this.isFavourited ? 'Remove this from saved posts' : 'Save this post for later'
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
      mailItems: 'loggedin/postthread/mailItems',
      connectionInvitesFromMe: 'loggedin/userconnections/connectionInvitesFromMe'})
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
    // We make use of userconnections for this page
    this.$store.dispatch('loggedin/userconnections/ensureInitialised')
  },
  methods: {
    onDeleted () {
      this.$router.push({name: 'latestPosts'})
    },
    gotoPostUser () {
      this.$router.push({name: 'userDetail', params: {userId: this.post.postedBy}})
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
    'mail-thread-container': MailThreadContainer,
    'post-detail-display': PostDetailDisplay,
    'form-segment': FormSegment
  }
}
</script>

<style>
</style>
