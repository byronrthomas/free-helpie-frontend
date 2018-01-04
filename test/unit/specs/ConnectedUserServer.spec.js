import {ConnectedUserServer} from '@/store/mockServer/connectedUserServer'
import {runAll} from '@/store/mockServer/callbackTools'


const USER_WHO_POSTS_INVITE = {id: 0, username: 'UserWhoInvitesConnection', authToken: Math.random()}
const USER_RECEIVING_INVITE = {id: 55, username: 'UserWhoGetsInvite', authToken: Math.random()}

const ACCEPTED_CONNECTIONS = 'accepted connections'
const GET_METHODS = [ACCEPTED_CONNECTIONS, 'invited connections']
function getSubjects (getMethod) {
  return getMethod === ACCEPTED_CONNECTIONS
    ? {correctUser: USER_WHO_POSTS_INVITE, otherUser: USER_RECEIVING_INVITE}
    : {correctUser: USER_RECEIVING_INVITE, otherUser: USER_WHO_POSTS_INVITE}
} 
const ALL_USERS = [USER_WHO_POSTS_INVITE, USER_RECEIVING_INVITE]

const DUMMY_AUTHER = {}

function checkBothPairsForResult(onTest, expectedResult) {
  it(`GET-CONNECTION-ACTIVE on pair ${ALL_USERS[0].username}, ${ALL_USERS[1].username} should return ${expectedResult}`, () => {
    fail()
  })

  it(`GET-CONNECTION-ACTIVE on pair ${ALL_USERS[1].username}, ${ALL_USERS[0].username} should return  ${expectedResult}`, () => {
    fail()
  })
}

function itShouldReportThatConnectionBetweenUsersIsActive(onTest) {
  checkBothPairsForResult(onTest, true)
}

function itShouldReportThatNoConnectionBetweenUsersIsActive(onTest) {
  checkBothPairsForResult(onTest, false)
}

describe('connectedUserServer', () => {
  it('should be possible to post an accept connection for the logged in user', () => {
    fail()
  })
  it('should refuse a post for a user that the token doesn\'t currently authorise', () => {
    fail()
  })

  it('should refuse a delete for an accept connection that doesn\'t exist', () => {
    fail()
  })

  describe('when no posts have been made', () => {
    const onTest = new ConnectedUserServer(DUMMY_AUTHER)
    for (const getMethod of GET_METHODS) {
      for (const user of ALL_USERS) {
        it(`GET should give an empty list for ${getMethod} when asked about ${user.username}`, () => {
          fail()
        })
      }
    }
  
    itShouldReportThatNoConnectionBetweenUsersIsActive(onTest)
  })

  describe('after a post has been made', () => {
    let onTest
    beforeEach(() => {
      throw new Error('Do something')
    })

    it('should be possible to delete it', () => {
      fail()
    })
    for (const getMethod of GET_METHODS) {
      const subjects = getSubjects(getMethod) 
      it(`GET should contain the invite in ${getMethod} when asking about ${subjects.correctUser.username}`, () => {
        fail()
      })
      it(`GET should not contain the invite in ${getMethod} when asking about ${subjects.otherUser.username}`, () => {
        fail()
      })
    }
    itShouldReportThatNoConnectionBetweenUsersIsActive(onTest)

    after('a the post has been deleted', () => {
      const subjects = getSubjects(getMethod) 
      for (const getMethod of GET_METHODS) {
        it(`GET should not contain the invite in ${getMethod} when asking about ${subject.otherUser.username}`, () => {
          fail()
        })
        it(`GET should not contain the invite in ${getMethod} when asking about ${subject.correctUser.username}`, () => {
          fail()
        })
      }
    })
  })

  describe('after both users have posted an invite to each other', () => {
    let onTest
    beforeEach(() => {throw new Error('fail')})

    itShouldReportThatConnectionBetweenUsersIsActive(onTest)

    for (const user of ALL_USERS) {
      describe(`if ${user.username} deletes their invite`, () => {
        beforeEach(() => {throw new Error('fail')})

        itShouldReportThatNoConnectionBetweenUsersIsActive(onTest)
      })
    }
  })
})