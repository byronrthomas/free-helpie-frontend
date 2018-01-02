import {UserAccountServer} from '@/store/mockServer/userAccountServer'
import {INITIAL_ACCOUNT_DETAILS} from '@/store/mockServer/initialAccountDetails'
import {runAll} from '@/store/mockServer/callbackTools'

const LOGGED_IN_USER_ID = {id: 0, username: 'LoggedInUser', authToken: Math.random()}
const NONCONNECTED_USER_ID = {id: 55, username: 'AnotherUserWhoHasNotConnectedYet', authToken: Math.random()}
const CONNECTED_USER_ID = {id: 77, username: 'AnotherUserWeAreConnectedTo', authToken: Math.random()}

function tokenAndUserIdMatches (user, token, userId) {
  // console.log('Checking for user', user)
  // console.log('token = ', token)
  // console.log('userId = ', userId)
  return userId === user.id && token === user.authToken
}

function userIsLoggedInAndAskingForConnectedUserDetails (token, userId) {
  return token === LOGGED_IN_USER_ID.authToken && 
  userId === CONNECTED_USER_ID.id 
}

function userIdMatchesTokenForSomeKnownUser(token, userId) {
  return tokenAndUserIdMatches(LOGGED_IN_USER_ID, token, userId)
  || tokenAndUserIdMatches(NONCONNECTED_USER_ID, token, userId)
  || tokenAndUserIdMatches(CONNECTED_USER_ID, token, userId)
}

const dummyAuther = {
  syncCanPostAccountDetails(token, userId) {
    return userIdMatchesTokenForSomeKnownUser(token, userId)
  },
  syncGetIsAllowedToSeeAccountDetails(token, userId) {
    return userIdMatchesTokenForSomeKnownUser(token, userId)
      || userIsLoggedInAndAskingForConnectedUserDetails(token, userId)
  }
}

function makeReqFromUser(remainingReq, userId) {
  return {authToken: userId.authToken, ...remainingReq}
}

function makeReq(remainingReq) {
  return makeReqFromUser(remainingReq, LOGGED_IN_USER_ID)
}

const TEST_ACCOUNT_DATA = INITIAL_ACCOUNT_DETAILS['0']
const TEST_REQ_DATA = {data: TEST_ACCOUNT_DATA, userId: LOGGED_IN_USER_ID.id}

function shouldRunSuccessfully(method, data, checkResult) {
  const checker = checkResult || (x => true)
  let hasSucceeded = false
  method(
    data,
    res => { hasSucceeded = true; checker(res) },
    err => {throw err}
  )
  expect(hasSucceeded).toBeTruthy()
}

function checkPostsEqualTo(expectedResults) {
  return res => expect(extractPostData(res.data)).toEqual(expectedResults)
} 

describe ('UserAccountServer', () => {
  const checkNoResults = res => expect(extractPostData(res.data)).toHaveLength(0)

  it('should accept post requests', () => {
    const onTest = new UserAccountServer(dummyAuther)
    
    shouldRunSuccessfully(onTest.post, makeReq(TEST_REQ_DATA))
  }),

  it('should accept post requests from another user', () => {
    const onTest = new UserAccountServer(dummyAuther)
    const otherUser = NONCONNECTED_USER_ID
    const reqData = {
      data: TEST_ACCOUNT_DATA,
      userId: otherUser.id
    }

    shouldRunSuccessfully(onTest.post, makeReqFromUser(reqData, otherUser))
  }),

  describe('after a post', () => {
    let onTest
    const userId = TEST_REQ_DATA.userId
    const accountDetails = TEST_REQ_DATA.data
    beforeEach(() => {
      onTest = new UserAccountServer(dummyAuther)
      onTest.post(
        makeReq(TEST_REQ_DATA), 
        res => {}, 
        err => {throw err})
    })

    it('should be possible to get the details back', () => {
      shouldRunSuccessfully(onTest.get, makeReq({userId: userId}),
      res => {expect(res.data).toEqual(accountDetails)})
    })

    it('should be possible to put an edited version of the existing account details', () => {
      const newDetails = {email: 'justanotheremailguy@test.com', ...accountDetails.data}
      shouldRunSuccessfully(onTest.put, makeReq({data: newDetails, userId: userId}))
    })
      
    describe('after putting an edited version of the post', () => {
      it('should give back the edited version on the next get', () => {
        const newDetails = {email: 'justanotheremailguy@test.com', ...accountDetails.data}
        shouldRunSuccessfully(onTest.put, makeReq({data: newDetails, userId: userId}))
        shouldRunSuccessfully(
          onTest.get,
          makeReq({userId: userId}),
          res => {expect(res.data).toEqual(newDetails)})
      })
    })
  })

  describe('after a user we are connected to has posted their details', () => {
    const otherUserDetails = INITIAL_ACCOUNT_DETAILS['1']
    const otherUser = CONNECTED_USER_ID
    let onTest
    beforeEach(() => {
      onTest = new UserAccountServer(dummyAuther)
      onTest.post(
        makeReqFromUser({data: otherUserDetails, userId: otherUser.id}, otherUser), 
        res => {}, 
        err => {throw err})
    })

    it('should be possible to get the details back', () => {
      shouldRunSuccessfully(onTest.get, makeReq({userId: otherUser.id}),
        res => {expect(res.data).toEqual(otherUserDetails)})
    })
  })

  describe('after a user we are not connected to has posted their details', () => {
    const otherUserDetails = INITIAL_ACCOUNT_DETAILS['1']
    const otherUser = NONCONNECTED_USER_ID
    let onTest
    beforeEach(() => {
      onTest = new UserAccountServer(dummyAuther)
      onTest.post(
        makeReqFromUser({data: otherUserDetails, userId: otherUser.id}, otherUser), 
        res => {}, 
        err => {throw err})
    })

    it('should not be possible to get the details back - the server should give an empty result', () => {
      shouldRunSuccessfully(onTest.get, makeReq({userId: otherUser.id}),
        res => {expect(res.data).toEqual(null)})
    })
  })

})