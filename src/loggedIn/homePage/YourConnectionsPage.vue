<template>
<div>
  <connections-container
    :header-text="'Requests from other users to connect'"
    :next-action="'Accept invite'"
    :summaries="pendingInvitesToMe"
    @summaryActionClicked="makeInvite"
    @viewUser="viewUser" />
  <hr>
  <connections-container
    :header-text="'Pending invites you have made to connect with others'"
    :next-action="'Cancel invite'"
    :summaries="pendingInvitesFromMe"
    @summaryActionClicked="cancelInvite"
    @viewUser="viewUser" />
  <hr>
  <connections-container
    :header-text="'Users you are already connected with'"
    :next-action="'Cancel sharing'"
    :summaries="activeConnections"
    @summaryActionClicked="cancelInvite"
    @viewUser="viewUser" />
</div>
</template>

<script>
import ConnectionsContainer from './ConnectionsContainer.vue'
import {mapGetters} from 'vuex'

function getPostSubject (postInfo, postId) {
  const post = postInfo[postId] || {subject: ''}
  return post.title
}

function getDisplayName (userInfo, userId) {
  const user = userInfo[userId] || {name: '[Unknown]'}
  return user.name
}

function makeSummary (invite, postInfo, userInfo) {
  return {
    withName: getDisplayName(userInfo, invite.otherUser),
    postSubject: getPostSubject(postInfo, invite.relatedToPostId),
    inviteSent: invite.inviteSent,
    otherUserId: invite.otherUser
  }
}

export default {
  computed: {
    // Create an extra property to make the watch be on a single property
    allPostIds () {
      return this.rawPendingInvitesToMe.concat(
        this.rawPendingInvitesFromMe, this.rawActiveConnections)
        .map(invite => invite.relatedToPostId)
    },
    allUserIds () {
      return this.rawPendingInvitesToMe.concat(
        this.rawActiveConnections, this.rawPendingInvitesFromMe)
        .map(invite => invite.otherUser)
    },
    pendingInvitesFromMe () {
      return this.rawPendingInvitesFromMe.map(invite => makeSummary(invite, this.postInfo, this.userInfo))
    },
    pendingInvitesToMe () {
      return this.rawPendingInvitesToMe.map(invite => makeSummary(invite, this.postInfo, this.userInfo))
    },
    activeConnections () {
      return this.rawActiveConnections.map(invite => makeSummary(invite, this.postInfo, this.userInfo))
    },
    ...mapGetters({
      'rawPendingInvitesToMe': 'loggedin/userconnections/pendingInvitesToMe',
      'rawPendingInvitesFromMe': 'loggedin/userconnections/pendingInvitesFromMe',
      'rawActiveConnections': 'loggedin/userconnections/activeConnections',
      'postInfo': 'loggedin/userconnectionsposts/getPosts',
      'userInfo': 'loggedin/userconnectionsusers/userInfo'})
  },
  methods: {
    makeInvite (otherUserId) {
      this.$store.dispatch('loggedin/userconnections/inviteConnection', {
        otherUser: otherUserId
      })
    },
    cancelInvite (otherUserId) {
      this.$store.dispatch('loggedin/userconnections/cancelConnection', otherUserId)
    },
    viewUser (userId) {
      this.$router.push({name: 'userDetail', params: {userId}})
    }
  },
  watch: {
    allPostIds (newValue) {
      this.$store.dispatch('loggedin/userconnectionsposts/setPostIdsFilter', newValue)
    },
    allUserIds (newValue) {
      this.$store.dispatch('loggedin/userconnectionsusers/getUserInfo', newValue)
    }
  },
  created () {
    this.$store.dispatch('loggedin/userconnections/ensureInitialised')
    this.$store.dispatch('loggedin/userconnectionsposts/setPostIdsFilter', this.allPostIds)
    this.$store.dispatch('loggedin/userconnectionsusers/getUserInfo', this.allUserIds)
  },
  components: {
    'connections-container': ConnectionsContainer
  }
}
</script>
