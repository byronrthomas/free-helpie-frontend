<template>
<div>
  <connections-container 
    :header-text="'Requests from other users to connect'"
    :next-action="'Accept invite'"
    :summaries="connectionRequests" />
  <hr>
  <connections-container 
    :header-text="'Pending invites you have made to connect with others'"
    :next-action="'Cancel invite'"
    :summaries="pendingInvites" />
  <hr>
  <connections-container 
    :header-text="'Users you are already connected with'"
    :next-action="'Cancel sharing'"
    :summaries="activeConnections" />
</div>
</template>

<script>
const CONNECTION_REQUESTS = [
  {
    id: 0, 
    postSubject: 'Can somebody give me some executive coaching please', 
    connectionName: 'Jana Swiss', 
    inviteSent: new Date(2000, 3, 1, 19, 10, 15)
  },
  {
    id: 1, 
    postSubject: 'Can somebody give me some executive coaching please', 
    connectionName: 'A.N.Other', 
    inviteSent: new Date(2000, 3, 1, 16, 17, 4)
  }
]

const PENDING_INVITES = [
  {
    id: 2, 
    postSubject: 'Help around Garden', 
    connectionName: 'John Doe', 
    inviteSent: new Date(2000, 4, 1, 9, 34, 47)
  },
  {
    id: 3, 
    postSubject: 'Some other post', 
    connectionName: 'A.N.Other', 
    inviteSent: new Date(2000, 5, 1, 16, 17, 4)
  }
]

const ACTIVE_CONNECTIONS = [
  {
    id: 4,
    postSubject: '',
    connectionName: 'Wendy Small',
    inviteSent: new Date(2000, 1, 1, 17, 0, 4)
  }
]

import ConnectionsContainer from './ConnectionsContainer.vue'
export default {
  data () {
    return {
      connectionRequests: CONNECTION_REQUESTS,
      activeConnections: ACTIVE_CONNECTIONS,
      pendingInvites: PENDING_INVITES
    }
  },
  components: {
    'connections-container': ConnectionsContainer
  }
}
</script>
