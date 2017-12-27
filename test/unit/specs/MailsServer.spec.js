import {MailsServer} from '@/store/mockServer/mailsServer'
import {runAll} from '@/store/mockServer/callbackTools'
import {INITIAL_MAIL_USERS, INITIAL_MAILS, INITIAL_POSTS} from './initialMails'


const THREAD_AUTHOR_ID = {id: 0, username: 'UserRespondingToThePost', authToken: Math.random()}
const POST_AUTHOR_ID = {id: 55, username: 'UserWhoPosted', authToken: Math.random()}

const dummyAuther = {
  syncGetUserCanPostMails(token) {
    return typeof token !== 'undefined'
  },
  syncGetUserCanSeeFullPosts(token) {
    return typeof token !== 'undefined'
  },
  syncGetUserCanUpdate(token) {
    return typeof token !== 'undefined'
  },
  syncGetUserCanDelete (token, postId) {
    return typeof token !== 'undefined'
  },
  syncGetAuthUsers (token) {
    // console.log("getUsersForToken", token)
    // console.log("ThreadAuthor", THREAD_AUTHOR_ID)
    // console.log("PostAuthor", POST_AUTHOR_ID)
    if (token === THREAD_AUTHOR_ID.authToken) {
      return [THREAD_AUTHOR_ID]
    } if (token === POST_AUTHOR_ID.authToken) {
      return [POST_AUTHOR_ID]
    }
    const userFromInitialMails = INITIAL_MAIL_USERS.find(x => token === x.authToken)
    return userFromInitialMails ? [userFromInitialMails] : []
  },
  syncGetUserCanReadMails (token, postId, threadAuthor) {
    return typeof token !== 'undefined'
  }
}

function makeReqFromUser(remainingReq, userId) {
  return {authToken: userId.authToken, ...remainingReq}
}

function makeReq(remainingReq) {
  return makeReqFromUser(remainingReq, THREAD_AUTHOR_ID)
}

const TEST_POST_ID = 55
const TEST_MAIL_DATA = {
  threadAuthor: THREAD_AUTHOR_ID.username,
  postAuthor: POST_AUTHOR_ID.username,
  relatedToPostId: TEST_POST_ID,
  mailText: 'Hello, maybe I could help you, I live locally'
}

function findPostedBy (postId) {
  const res = INITIAL_POSTS.find(post => post.postId === postId)
  if (!res) {
    throw new Error("Cannot find any thread for postId " + postId)
  }
  return res.postedBy
}

const dummyPostServer = {
  syncGetPostedBy(postId) {
    return postId === TEST_POST_ID ? POST_AUTHOR_ID.username : findPostedBy(postId).username
  }
}

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

function expectRespDataToEqual(expectedData) {
  return res => expect(res.data).toEqual(expectedData)
}

// This is like the equivalent of F# seq.collect, apply
// a function of 'a -> 'b Array on each element of a 'a Array
// and concat the resulting arrays to give a result 'b Array
function arrayCollect(collectFun, inputArray) {
  const arrayOfArrays = inputArray.map(collectFun)
  return arrayOfArrays.reduce((l, r) => l.concat(r), [])
}

function reqForTestMail (threadId, testMail) {
  const reqData = {
    mailText: testMail.text,
    ...threadId} 
  return makeReqFromUser({data: reqData}, testMail.sender)
}

function reqsForThread (threadContents) {
  const threadId = threadContents.threadId
  return threadContents.mails.map((mail) => reqForTestMail(threadId, mail))
}

describe ('MailsServer', () => {
  const checkNoResults = res => expect(extractPostData(res.data)).toHaveLength(0)

  it('should accept post requests', () => {
    const onTest = new MailsServer(dummyAuther, dummyPostServer)
    
    shouldRunSuccessfully(onTest.post, makeReq({data: TEST_MAIL_DATA}))
  }),

  it('should refuse a post request where the user is not the postAuthor or the threadAuthor', () => {
    const onError = jest.fn()
    const onSuccess = jest.fn()

    const onTest = new MailsServer(dummyAuther, dummyPostServer)
    const anotherUser = INITIAL_MAIL_USERS[0]
    const req = makeReqFromUser({data: TEST_MAIL_DATA}, anotherUser)
    onTest.post(req, onSuccess, onError)

    expect(onError.mock.calls).toEqual([[expect.any(Error)]])
    expect(onSuccess.mock.calls).toHaveLength(0)
    // Again, I could just make it so that I don't trust & check I write it
  })

  describe('after a mail is posted', () => {
    const mailContents = TEST_MAIL_DATA
    const mailThreadId = {
      relatedToPostId: mailContents.relatedToPostId,
      threadAuthor: mailContents.threadAuthor
    }
    let onTest
    let justBeforePost
    beforeEach(() => {
      onTest = new MailsServer(dummyAuther, dummyPostServer)
      justBeforePost = new Date()
      onTest.post(
        makeReq({data: mailContents}), 
        res => { },
        err => {throw err})
    })

    it('should return the mail from a request to get the thread', () => {
      const checkRes = res => {
        expect(res.data).toEqual([expect.objectContaining({text: mailContents.mailText})])
      }
      shouldRunSuccessfully(onTest.getMailThread, makeReq({data: mailThreadId}), checkRes)
    })

    it('should have been persisted with an ID, a sent datetimestamp, and with logged in user recorded as the sender', () => {
      const checkRes = res => {
        expect(res.data).toEqual([expect.objectContaining({
          sender: THREAD_AUTHOR_ID.username,
          id: expect.any(Number),
          sent: expect.any(Date)
        })])
        expect(res.data[0].sent.getTime()).toBeGreaterThanOrEqual(justBeforePost.getTime())
        expect(res.data[0].id).toBeGreaterThanOrEqual(0)
      }

      shouldRunSuccessfully(onTest.getMailThread, makeReq({data: mailThreadId}), checkRes)
    })

    it('should be possible to post another mail on the same thread', () => {
      shouldRunSuccessfully(onTest.post, makeReq({data: mailContents}))
    })

    it('the thread should be returned by a query to fetch active threads of the post author', () => {
      const reqByPostAuthor = makeReqFromUser({}, POST_AUTHOR_ID)
      shouldRunSuccessfully(onTest.getActiveThreads, reqByPostAuthor, expectRespDataToEqual([mailThreadId]))
    })

    it('the thread should be returned by a query to fetch active threads of the thread author', () => {
      shouldRunSuccessfully(onTest.getActiveThreads, makeReq({}), expectRespDataToEqual([mailThreadId]))
    })

    it('it should be possible to read the contents of the thread in a different sort order', () => {
      // Look at what the rest of the world expects
      fail()
    })

    describe('after posting another mail on the same thread', () => {
      beforeEach(() => {
        onTest.post(
          makeReq({data: mailContents}), 
          res => { },
          err => {throw err})
      })

      it('the new message should extend the mail thread', () => {
        const checkRes = res => {
          expect(res.data).toHaveLength(2)
        }
        shouldRunSuccessfully(onTest.getMailThread, makeReq({data: mailThreadId}), checkRes)
      })
    })
  })

  it('should be possible to post multiple mails on multiple threads', () => {
    const onTest = new MailsServer(dummyAuther, dummyPostServer)
    runAll(onTest.post, arrayCollect(reqsForThread, INITIAL_MAILS))
  })

  describe('after multiple mails have been posted on multiple threads', () => {
    const expectedMailThreads = INITIAL_MAILS
    const postedThreadIds = expectedMailThreads.map(thread => thread.threadId)
    let onTest
    beforeEach(() => {
      onTest = new MailsServer(dummyAuther, dummyPostServer)

      runAll(onTest.post, arrayCollect(reqsForThread, expectedMailThreads))
    })

    for (const thread of expectedMailThreads) {
      for (const role of ['post author', 'thread author']) {
        const user = role === 'post author' 
          ? thread.postAuthor
          : thread.threadAuthor
        it(`should report thread ${thread.threadName} as active for the ${role} - ${user.username}`, () => {
          const reqByPostAuthor = makeReqFromUser({}, user)
          const checkRes = res => expect(res.data).toEqual(expect.arrayContaining([thread.threadId]))
          shouldRunSuccessfully(onTest.getActiveThreads, reqByPostAuthor, checkRes)
        })
      }

      it(`initially ${thread.userWithUnread.username} should have unread mails for thread ${thread.threadName}`, () => {
        const reqByUser = makeReqFromUser({}, thread.userWithUnread)
        const checkRes = res => expect(res.data).toEqual(expect.arrayContaining([thread.threadId]))
        shouldRunSuccessfully(onTest.getUnreadThreads, reqByUser, checkRes)
      })
    }

    const threadToWorkWith = expectedMailThreads[0]
    it (`should be possible for ${threadToWorkWith.userWithUnread.username} to mark thread ${threadToWorkWith.threadName} as read`, () => {
      const reqByUser = makeReqFromUser({data: {readMailId: 1, ...threadToWorkWith.threadId}}, threadToWorkWith.userWithUnread)
      shouldRunSuccessfully(onTest.postMarkAsRead, reqByUser)
    })

    describe(`after ${threadToWorkWith.userWithUnread.username} has read the thread`, () => {
      it('should not appear as unread for them when queried', () => {
        fail()
      })

      it('should switch back to unread if another mail occurs', () => {
        fail()
      })

      it('should not become unread if they mail and no other mail occurs', () => {
        fail()
      })
    })
  })
})