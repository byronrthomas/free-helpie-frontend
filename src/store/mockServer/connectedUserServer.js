function recordInviteOneWay(inMap, userA, userB, toRecord) {
  if (!inMap.has(userA)) {
    inMap.set(userA, new Map())
  }
  const innerMap = inMap.get(userA)
  innerMap.set(userB, toRecord)
}

function makeConnectionRecord(keyAndValue) {
  return {
    otherUser: keyAndValue[0], 
    relatedToPostId: keyAndValue[1].relatedToPostId, 
    inviteSent: keyAndValue[1].timestamp}
}

function getConnectionRecords(map, userId) {
  if (!map.has(userId)) {
    return []
  } else {
    return Array.from(map.get(userId).entries(), makeConnectionRecord)
  }
}

export function ConnectedUserServer (userAuth, initialData) {
  const invitesFromUser = new Map()
  const invitesToUser = new Map()

  const recordInvite = (fromUser, toUser, postId, atTime) => {
    const toRecord = {relatedToPostId: postId, timestamp: atTime}
    recordInviteOneWay(invitesFromUser, fromUser, toUser, toRecord)
    recordInviteOneWay(invitesToUser, toUser, fromUser, toRecord)
  }
  if (initialData && initialData.length > 0) {
    for (const invite of initialData) {
      recordInvite(invite.fromUser, invite.toUser, invite.relatedToPostId, invite.timestamp)
    }
  }

  const invitedFrom = (userA, userB) => {
    return invitesFromUser.has(userA) 
      && invitesFromUser.get(userA).has(userB)
  }
  const deleteInvite = (fromUser, toUser) => {
    invitesFromUser.get(fromUser).delete(toUser)
    invitesToUser.get(toUser).delete(fromUser)
  }

  return {
    getConnectionsFrom (reqData, resolve, reject) {
      console.log('GET connectionsFromUser: req = ', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot get user profile without a userId'))
        return
      }
      if (!userAuth.syncGetIsAllowedToSeeConnections(reqData.authToken, reqData.userId)) {
        console.log('Not authorised to get details for userID, returning null, userId: ', reqData.userId)
        reject(new Error(`Not allowed to see connections of user `, reqData.userId))
        return
      }
      const userId = reqData.userId
      const respData = getConnectionRecords(invitesFromUser, userId)
      resolve({data: respData})
    },
    getConnectionsTo (reqData, resolve, reject) {
      console.log('GET connectionsToUser: req = ', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot get user profile without a userId'))
        return
      }
      if (!userAuth.syncGetIsAllowedToSeeConnections(reqData.authToken, reqData.userId)) {
        console.log('Not authorised to get details for userID, returning null, userId: ', reqData.userId)
        reject(new Error(`Not allowed to see connections of user `, reqData.userId))
        return
      }
      const userId = reqData.userId
      const respData = getConnectionRecords(invitesToUser, userId)
      resolve({data: respData})
    },
    syncGetUsersMayConnect (userA, userB) {
      return invitedFrom(userA, userB) && invitedFrom(userB, userA)
    },
    postConnectionRequest (reqData, resolve, reject) {
      console.log('POST connection invite: req = ', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot post user profile without a userId'))
        return
      }
      const userId = reqData.userId
      if (!userAuth.syncCanPostConnectionInvite(reqData.authToken, userId)) {
        reject(new Error('Not authorised to post details for userId - ' + userId))
        return
      }

      if (!reqData.hasOwnProperty('data') || !reqData.data.hasOwnProperty('invitedUserId')) {
        reject(new Error('Cannot post invite, request must contain a data field with an invitedUserId field on it'))
        return
      }

      console.log('POST connection invite: Saving user data for userID ' + userId)
      const otherUserId = reqData.data.invitedUserId
      recordInvite(userId, otherUserId, reqData.data.relatedToPostId, new Date())
      resolve()
    },
    deleteConnectionRequest (reqData, resolve, reject) {
      console.log('DELETE connection invite: req = ', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot delete connection invite without a userId'))
        return
      }
      const userId = reqData.userId
      if (!userAuth.syncCanPostConnectionInvite(reqData.authToken, userId)) {
        reject(new Error('Not authorised to delete connection invite for userId - ' + userId))
        return
      }

      if (!reqData.hasOwnProperty('data') || !reqData.data.hasOwnProperty('invitedUserId')) {
        reject(new Error('Cannot delete invite, request must contain a data field with an invitedUserId field on it'))
        return
      }

      console.log('DELETE connection invite: Saving user data for userID ' + userId)
      const otherUserId = reqData.data.invitedUserId
      deleteInvite(userId, otherUserId)
      resolve()
    }
  }
}
