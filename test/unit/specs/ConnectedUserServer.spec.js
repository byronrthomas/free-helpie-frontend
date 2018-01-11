import {ConnectedUserServer} from '@/store/mockServer/connectedUserServer'

const USER_WHO_POSTS_INVITE = {id: 0, username: 'UserWhoInvitesConnection', authToken: Math.random()}
const USER_RECEIVING_INVITE = {id: 55, username: 'UserWhoGetsInvite', authToken: Math.random()}
const TEST_POST_ID = 777

const ACCEPTED_CONNECTIONS = 'accepted connections'
const GET_METHODS = [ACCEPTED_CONNECTIONS, 'invited connections']
function getSubjects (getMethod) {
  return getMethod === ACCEPTED_CONNECTIONS
    ? {correctUser: USER_WHO_POSTS_INVITE, otherUser: USER_RECEIVING_INVITE}
    : {correctUser: USER_RECEIVING_INVITE, otherUser: USER_WHO_POSTS_INVITE}
}
function lookupMethod (getMethod, onTest) {
  return getMethod === ACCEPTED_CONNECTIONS
    ? onTest.getConnectionsFrom
    : onTest.getConnectionsTo
}
const ALL_USERS = [USER_WHO_POSTS_INVITE, USER_RECEIVING_INVITE]

function inferUserId (token) {
  return token === USER_WHO_POSTS_INVITE.authToken
    ? USER_WHO_POSTS_INVITE.id
    : (token === USER_RECEIVING_INVITE.authToken
      ? USER_RECEIVING_INVITE.id
      : null)
}

function makeAuther () {
  return {
    syncCanPostConnectionInvite (token, userId) {
      const loggedInUserId = inferUserId(token)
      // For now - are they loggedin and posting to their own userId?
      return (typeof userId !== 'undefined') && userId === loggedInUserId
    },
    syncGetIsAllowedToSeeConnections (token, userId) {
      const loggedInUserId = inferUserId(token)
      // For now - are they loggedin and posting to their own userId?
      return (typeof userId !== 'undefined') && userId === loggedInUserId
    },
    syncPostGrantViewDetails: jest.fn(),
    syncPostRevokeViewDetails: jest.fn()
  }
}

function expectToSucceed (method, req) {
  const resolve = jest.fn()
  const reject = jest.fn()
  method(req, resolve, reject)
  if (reject.mock.calls.length > 0) {
    throw reject.mock.calls[0][0]
  }
  expect(resolve.mock.calls).toHaveLength(1)
  return {andRespData () {
    return expect(resolve.mock.calls[0][0].data)
  }}
}

function expectToFail (method, req) {
  const resolve = jest.fn()
  const reject = jest.fn()
  method(req, resolve, reject)
  expect(resolve.mock.calls).toHaveLength(0)
  expect(reject.mock.calls).toHaveLength(1)
}

function reqFromUser (userId) {
  return {authToken: userId.authToken}
}

/// WithPostId is optional as it's only for information purposes
function fillReqDataForUsers ({fromUser, toUser}, withPostId) {
  const data =
    withPostId
    ? {invitedUserId: toUser.id, relatedToPostId: TEST_POST_ID}
    : {invitedUserId: toUser.id}
  return {userId: fromUser.id, data}
}

function fillReqDataForUser (fromUser) {
  return {userId: fromUser.id}
}

function displayName (user) {
  return user.username
}

function checkBothPairsHaveBeenCalled (mock) {
  const bothPairsOfIds = [
    [ALL_USERS[0].id, ALL_USERS[1].id],
    [ALL_USERS[1].id, ALL_USERS[0].id]
  ]
  expect(mock.calls).toEqual(expect.arrayContaining(bothPairsOfIds))
}

function itShouldHaveGrantedViewDetailsBetweenTheUsers (refCell) {
  it('should have granted permissions to view user details in both directions', () => {
    checkBothPairsHaveBeenCalled(refCell.auther.syncPostGrantViewDetails.mock)
  })
}

function itShouldNotHaveGrantedAnyDetailViewing (refCell) {
  it('should not have granted any permissions to view user details', () => {
    expect(refCell.auther.syncPostGrantViewDetails.mock.calls).toHaveLength(0)
  })
}

const A_INVITES_B = {
  fromUser: USER_WHO_POSTS_INVITE,
  toUser: USER_RECEIVING_INVITE
}

function getReqForUserLoggedIn (user) {
  return {...fillReqDataForUser(user), ...reqFromUser(user)}
}

describe('connectedUserServer', () => {
  it('should be possible to post an accept connection for the logged in user', () => {
    const onTest = new ConnectedUserServer(makeAuther())
    const req = {...fillReqDataForUsers(A_INVITES_B), ...reqFromUser(A_INVITES_B.fromUser)}
    expectToSucceed(onTest.postConnectionRequest, req)
  })

  it('should refuse a post for a user that the token doesn\'t currently authorise', () => {
    const onTest = new ConnectedUserServer(makeAuther())
    const req = {...fillReqDataForUsers(A_INVITES_B), ...reqFromUser(A_INVITES_B.toUser)}
    expectToFail(onTest.postConnectionRequest, req)
  })

  it('should refuse a delete for an accept connection that doesn\'t exist', () => {
    const onTest = new ConnectedUserServer(makeAuther())
    const req = {...fillReqDataForUsers(A_INVITES_B), ...reqFromUser(A_INVITES_B.toUser)}
    expectToFail(onTest.deleteConnectionRequest, req)
  })

  it('should refuse a get for a userId that is not the logged in user', () => {
    const onTest = new ConnectedUserServer(makeAuther())
    const req = {...fillReqDataForUser(USER_RECEIVING_INVITE), ...reqFromUser(USER_WHO_POSTS_INVITE)}
    expectToFail(onTest.getConnectionsFrom, req)
  })

  it('should refuse a get invites for a userId that is not the logged in user', () => {
    const onTest = new ConnectedUserServer(makeAuther())
    const req = {...fillReqDataForUser(USER_RECEIVING_INVITE), ...reqFromUser(USER_WHO_POSTS_INVITE)}
    expectToFail(onTest.getConnectionsTo, req)
  })

  describe('when no posts have been made', () => {
    let onTest
    const refCell = {auther: null}
    beforeEach(() => {
      const auther = makeAuther()
      onTest = new ConnectedUserServer(auther)
      refCell.auther = auther
    })
    for (const getMethod of GET_METHODS) {
      for (const user of ALL_USERS) {
        it(`GET should give an empty list for ${getMethod} when asked about ${displayName(user)}`, () => {
          const req = {...fillReqDataForUser(user), ...reqFromUser(user)}
          expectToSucceed(lookupMethod(getMethod, onTest), req)
            .andRespData().toEqual([])
        })
      }
    }

    itShouldNotHaveGrantedAnyDetailViewing(refCell)
  })

  describe('after a post has been made', () => {
    let onTest
    const reqData = fillReqDataForUsers(A_INVITES_B)
    const fromUser = A_INVITES_B.fromUser
    const refCell = {auther: null}
    beforeEach(() => {
      const auther = makeAuther()
      onTest = new ConnectedUserServer(auther)
      refCell.auther = auther
      const req = {...fillReqDataForUsers(A_INVITES_B, true), ...reqFromUser(fromUser)}
      expectToSucceed(onTest.postConnectionRequest, req)
    })

    it('should be possible to delete it', () => {
      const req = {...reqData, ...reqFromUser(fromUser)}
      expectToSucceed(onTest.deleteConnectionRequest, req)
    })

    for (const getMethod of GET_METHODS) {
      const subjects = getSubjects(getMethod)
      it(`GET should contain the invite in ${getMethod} when asking about ${displayName(subjects.correctUser)}`, () => {
        const req = getReqForUserLoggedIn(subjects.correctUser)
        expectToSucceed(lookupMethod(getMethod, onTest), req).andRespData().toEqual(
          expect.arrayContaining([expect.objectContaining({otherUser: subjects.otherUser.id})])
        )
      })
      it(`and the invite from GET should contain a timestamp (${getMethod} when asking about ${displayName(subjects.correctUser)})`, () => {
        const req = getReqForUserLoggedIn(subjects.correctUser)
        expectToSucceed(lookupMethod(getMethod, onTest), req).andRespData().toEqual(
          expect.arrayContaining([expect.objectContaining({inviteSent: expect.any(Date)})])
        )
      })
      it(`and the invite from GET should contain a postId (${getMethod} when asking about ${displayName(subjects.correctUser)})`, () => {
        const req = getReqForUserLoggedIn(subjects.correctUser)
        expectToSucceed(lookupMethod(getMethod, onTest), req).andRespData().toEqual(
          expect.arrayContaining([expect.objectContaining({relatedToPostId: TEST_POST_ID})])
        )
      })
      it(`GET should not contain the invite in ${getMethod} when asking about ${displayName(subjects.otherUser)}`, () => {
        const req = getReqForUserLoggedIn(subjects.otherUser)
        expectToSucceed(lookupMethod(getMethod, onTest), req)
          .andRespData().toEqual([])
      })
    }
    itShouldNotHaveGrantedAnyDetailViewing(refCell)

    describe('after the post has been deleted', () => {
      beforeEach(() => {
        const req = {...reqData, ...reqFromUser(fromUser)}
        expectToSucceed(onTest.deleteConnectionRequest, req)
      })

      for (const getMethod of GET_METHODS) {
        const subjects = getSubjects(getMethod)
        it(`GET should not contain the invite in ${getMethod} when asking about ${displayName(subjects.otherUser)}`, () => {
          const req = getReqForUserLoggedIn(subjects.otherUser)
          expectToSucceed(lookupMethod(getMethod, onTest), req)
            .andRespData().toEqual([])
        })
        it(`GET should not contain the invite in ${getMethod} when asking about ${displayName(subjects.correctUser)}`, () => {
          const req = getReqForUserLoggedIn(subjects.correctUser)
          expectToSucceed(lookupMethod(getMethod, onTest), req)
            .andRespData().toEqual([])
        })
      }
    })
  })

  describe('after both users have posted an invite to each other', () => {
    let onTest
    const B_INVITES_A = {
      fromUser: USER_RECEIVING_INVITE,
      toUser: USER_WHO_POSTS_INVITE
    }
    const REQA = {...fillReqDataForUsers(A_INVITES_B), ...reqFromUser(A_INVITES_B.fromUser)}
    const REQB = {...fillReqDataForUsers(B_INVITES_A), ...reqFromUser(B_INVITES_A.fromUser)}
    const refCell = {auther: null}
    beforeEach(() => {
      const auther = makeAuther()
      onTest = new ConnectedUserServer(auther)
      refCell.auther = auther
      expectToSucceed(onTest.postConnectionRequest, REQA)
      expectToSucceed(onTest.postConnectionRequest, REQB)
    })

    itShouldHaveGrantedViewDetailsBetweenTheUsers(refCell)

    for (const user of ALL_USERS) {
      describe(`if ${user.username} deletes their invite`, () => {
        const deleteReq =
          user === USER_WHO_POSTS_INVITE
          ? REQA
          : REQB
        beforeEach(() => {
          expectToSucceed(onTest.deleteConnectionRequest, deleteReq)
        })

        itShouldHaveGrantedViewDetailsBetweenTheUsers(refCell)
      })
    }
  })
})
