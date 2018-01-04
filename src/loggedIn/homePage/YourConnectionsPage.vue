<template>
<div>
  <connections-container
    :header-text="'Requests from other users to connect'"
    :next-action="'Accept invite'"
    :summaries="pendingInvitesToMe" />
  <hr>
  <connections-container
    :header-text="'Pending invites you have made to connect with others'"
    :next-action="'Cancel invite'"
    :summaries="pendingInvitesFromMe" />
  <hr>
  <connections-container
    :header-text="'Users you are already connected with'"
    :next-action="'Cancel sharing'"
    :summaries="activeConnections" />
</div>
</template>

<script>
import ConnectionsContainer from './ConnectionsContainer.vue'
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters({
      'pendingInvitesToMe': 'loggedin/userconnections/pendingInvitesToMe',
      'pendingInvitesFromMe': 'loggedin/userconnections/pendingInvitesFromMe',
      'activeConnections': 'loggedin/userconnections/activeConnections',
      'userId': 'userId'})
  },
  created () {
    this.$store.dispatch('loggedin/userconnections/getConnections', this.userId)
  },
  components: {
    'connections-container': ConnectionsContainer
  }
}
</script>
