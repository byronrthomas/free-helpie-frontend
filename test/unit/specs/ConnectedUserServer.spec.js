import {ConnectedUserServer} from '@/store/mockServer/connectedUserServer'
import {runAll} from '@/store/mockServer/callbackTools'


const USER_WHO_POSTS_INVITE = {id: 0, username: 'UserWhoInvitesConnection', authToken: Math.random()}
const USER_RECEIVING_INVITE = {id: 55, username: 'UserWhoGetsInvite', authToken: Math.random()}
const startTime = new Date()

const ACCEPTED_CONNECTIONS = 'accepted connections'
const GET_METHODS = [ACCEPTED_CONNECTIONS, 'invited connections']
function getSubjects (getMethod) {
  return getMethod === ACCEPTED_CONNECTIONS
    ? {correctUser: USER_WHO_POSTS_INVITE, otherUser: USER_RECEIVING_INVITE}
    : {correctUser: USER_RECEIVING_INVITE, otherUser: USER_WHO_POSTS_INVITE}
} 
function lookupMethod (getMethod, onTest) {
  return getMethod === ACCEPTED_CONNECTIONS
    ? onTest.getAllowedConnections
    : onTest.getInvitedConnections
}
const ALL_USERS = [USER_WHO_POSTS_INVITE, USER_RECEIVING_INVITE]

function inferUserId (token) {
  return token === USER_WHO_POSTS_INVITE.authToken
    ? USER_WHO_POSTS_INVITE.id
    : (token === USER_RECEIVING_INVITE.authToken
      ? USER_RECEIVING_INVITE.id 
      : null)
}

const DUMMY_AUTHER = {
  syncCanPostConnectionInvite (token, userId) {
    const loggedInUserId = inferUserId(token)
    // For now - are they loggedin and posting to their own userId?
    return (typeof userId !== 'undefined') && userId === loggedInUserId
  },
  syncGetIsAllowedToSeeConnections (token, userId) {
    const loggedInUserId = inferUserId(token)
    // For now - are they loggedin and posting to their own userId?
    return (typeof userId !== 'undefined') && userId === loggedInUserId
  }

}

function expectToSucceed(method, req) {
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

function expectToFail(method, req) {
  const resolve = jest.fn()
  const reject = jest.fn()
  method(req, resolve, reject)
  expect(resolve.mock.calls).toHaveLength(0)
  expect(reject.mock.calls).toHaveLength(1)
}

function reqFromUser(userId) {
  return {authToken: userId.authToken}
}

function fillReqDataForUsers({fromUser, toUser}) {
  return {userId: fromUser.id, data: {invitedUserId: toUser.id}}
}

function fillReqDataForUser(fromUser) {
  return {userId: fromUser.id}
}

function displayName(user) {
  return user.username
}
function displayPair(pair) {
  return `(${displayName(pair.fromUser)}, ${displayName(pair.toUser)})`
}

function checkBothPairsForResult(cell, expectedResult) {
  const bothPairs = [
    {fromUser: ALL_USERS[0], toUser: ALL_USERS[1]},
    {fromUser: ALL_USERS[1], toUser: ALL_USERS[0]}
  ]
  for (const pair of bothPairs) {
    it(`GET-CONNECTION-ACTIVE on pair ${displayPair(pair)} should return ${expectedResult}`, () => {
      expect(cell.onTest.syncGetUsersMayConnect(pair.fromUser.id, pair.toUser.id)).toEqual(expectedResult)
    })
  }
}

function itShouldReportThatConnectionBetweenUsersIsActive(onTest) {
  checkBothPairsForResult(onTest, true)
}

function itShouldReportThatNoConnectionBetweenUsersIsActive(onTest) {
  checkBothPairsForResult(onTest, false)
}

const A_INVITES_B = {
  fromUser: USER_WHO_POSTS_INVITE,
  toUser: USER_RECEIVING_INVITE
}

function getReqForUserLoggedIn(user) {
  return {...fillReqDataForUser(user), ...reqFromUser(user)}
}

describe('connectedUserServer', () => {
  it('should be possible to post an accept connection for the logged in user', () => {
    const onTest = new ConnectedUserServer(DUMMY_AUTHER)
    const req = {...fillReqDataForUsers(A_INVITES_B), ...reqFromUser(A_INVITES_B.fromUser)}
    expectToSucceed(onTest.postAllowedConnection, req)
  })

  it('should refuse a post for a user that the token doesn\'t currently authorise', () => {
    const onTest = new ConnectedUserServer(DUMMY_AUTHER)
    const req = {...fillReqDataForUsers(A_INVITES_B), ...reqFromUser(A_INVITES_B.toUser)}
    expectToFail(onTest.postAllowedConnection, req)
  })

  it('should refuse a delete for an accept connection that doesn\'t exist', () => {
    const onTest = new ConnectedUserServer(DUMMY_AUTHER)
    const req = {...fillReqDataForUsers(A_INVITES_B), ...reqFromUser(A_INVITES_B.toUser)}
    expectToFail(onTest.deleteAllowedConnection, req)
  })

  it('should refuse a get for a userId that is not the logged in user', () => {
    const onTest = new ConnectedUserServer(DUMMY_AUTHER)
    const req = {...fillReqDataForUser(USER_RECEIVING_INVITE), ...reqFromUser(USER_WHO_POSTS_INVITE)}
    expectToFail(onTest.getAllowedConnections, req)
  })

  it('should refuse a get invites for a userId that is not the logged in user', () => {
    const onTest = new ConnectedUserServer(DUMMY_AUTHER)
    const req = {...fillReqDataForUser(USER_RECEIVING_INVITE), ...reqFromUser(USER_WHO_POSTS_INVITE)}
    expectToFail(onTest.getInvitedConnections, req)
  })

  describe('when no posts have been made', () => {
    let onTest
    const refCell = {onTest: null}
    beforeEach(() => {
      onTest = new ConnectedUserServer(DUMMY_AUTHER)
      refCell.onTest = onTest
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
  
    itShouldReportThatNoConnectionBetweenUsersIsActive(refCell)
  })

  describe('after a post has been made', () => {
    let onTest
    const reqData = fillReqDataForUsers(A_INVITES_B)
    const fromUser = A_INVITES_B.fromUser
    const refCell = {onTest: null}
    beforeEach(() => {
      onTest = new ConnectedUserServer(DUMMY_AUTHER)
      refCell.onTest = onTest
      const req = {...reqData, ...reqFromUser(fromUser)}
      expectToSucceed(onTest.postAllowedConnection, req)
    })

    it('should be possible to delete it', () => {
      const req = {...reqData, ...reqFromUser(fromUser)}
      expectToSucceed(onTest.deleteAllowedConnection, req)
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
      it(`GET should not contain the invite in ${getMethod} when asking about ${displayName(subjects.otherUser)}`, () => {
        const req = getReqForUserLoggedIn(subjects.otherUser)
        expectToSucceed(lookupMethod(getMethod, onTest), req)
          .andRespData().toEqual([])
      })
    }
    itShouldReportThatNoConnectionBetweenUsersIsActive(refCell)

    describe('after the post has been deleted', () => {
      beforeEach(() => {
        const req = {...reqData, ...reqFromUser(fromUser)}
        expectToSucceed(onTest.deleteAllowedConnection, req)
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
    const refCell = {onTest: null}
    beforeEach(() => {
      onTest = new ConnectedUserServer(DUMMY_AUTHER)
      refCell.onTest = onTest
      expectToSucceed(onTest.postAllowedConnection, REQA)
      expectToSucceed(onTest.postAllowedConnection, REQB)
    })

    itShouldReportThatConnectionBetweenUsersIsActive(refCell)

    for (const user of ALL_USERS) {
      describe(`if ${user.username} deletes their invite`, () => {
        const deleteReq = 
          user === USER_WHO_POSTS_INVITE
          ? REQA
          : REQB
        beforeEach(() => {
          expectToSucceed(onTest.deleteAllowedConnection, deleteReq)
        })

        itShouldReportThatNoConnectionBetweenUsersIsActive(refCell)
      })
    }
  })
})