import {MailsServer} from '@/store/mockServer/mailsServer'
import {runAll} from '@/store/mockServer/callbackTools'
import {TEST_MAIL_USERS, TEST_MAILS, TEST_POSTS} from './testMails'


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
      return [THREAD_AUTHOR_ID.id]
    } if (token === POST_AUTHOR_ID.authToken) {
      return [POST_AUTHOR_ID.id]
    }
    const userFromInitialMails = TEST_MAIL_USERS.find(x => token === x.authToken)
    return userFromInitialMails ? [userFromInitialMails.id] : []
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
  threadAuthor: THREAD_AUTHOR_ID.id,
  relatedToPostId: TEST_POST_ID,
  mailText: 'Hello, maybe I could help you, I live locally'
}

function findPostedBy (postId) {
  const res = TEST_POSTS.find(post => post.postId === postId)
  if (!res) {
    throw new Error("Cannot find any thread for postId " + postId)
  }
  return res.postedBy
}

const dummyPostServer = {
  syncGetPostedBy(postId) {
    return postId === TEST_POST_ID ? POST_AUTHOR_ID.id : findPostedBy(postId).id
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

function expectSentTimesAscending (mail1, mail2) {
  expect(mail2.sent.getTime()).toBeGreaterThan(mail1.sent.getTime())
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
    const anotherUser = TEST_MAIL_USERS[0]
    const req = makeReqFromUser({data: TEST_MAIL_DATA}, anotherUser)
    onTest.post(req, onSuccess, onError)

    expect(onError.mock.calls).toEqual([[expect.any(Error)]])
    expect(onSuccess.mock.calls).toHaveLength(0)
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
          sender: THREAD_AUTHOR_ID.id,
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
      const expectedThreadInfo = expect.objectContaining({threadId: mailThreadId})
      shouldRunSuccessfully(onTest.getActiveThreads, reqByPostAuthor, expectRespDataToEqual([expectedThreadInfo]))
    })

    it('the thread should be returned by a query to fetch active threads of the thread author', () => {
      const expectedThreadInfo = expect.objectContaining({threadId: mailThreadId})
      shouldRunSuccessfully(onTest.getActiveThreads, makeReq({}), expectRespDataToEqual([expectedThreadInfo]))
    })

    it('should report the post author in the thread info when fetching active threads', () => {
      const expectedThreadInfo = expect.objectContaining({postAuthor: POST_AUTHOR_ID.id})
      shouldRunSuccessfully(onTest.getActiveThreads, makeReq({}), expectRespDataToEqual([expectedThreadInfo]))
    })

    it('should report the latest sent time in the thread info when fetching active threads', () => {
      let persistedMail
      onTest.getMailThread(makeReq({data: mailThreadId}), 
        (res) => {persistedMail = res.data[0]},
        (err) => {throw err})

      const expectedThreadInfo = expect.objectContaining({latestMessageSent: persistedMail.sent})
      shouldRunSuccessfully(onTest.getActiveThreads, makeReq({}), expectRespDataToEqual([expectedThreadInfo]))
    })

    it('should report that the thread is read when the thread author fetches active threads', () => {
      const expectedThreadInfo = expect.objectContaining({unread: false})
      shouldRunSuccessfully(onTest.getActiveThreads, makeReq({}), expectRespDataToEqual([expectedThreadInfo]))
    })

    it('should report that the thread is unread when the post author fetches active threads', () => {
      const expectedThreadInfo = expect.objectContaining({unread: true})
      const req = makeReqFromUser({}, POST_AUTHOR_ID)
      shouldRunSuccessfully(onTest.getActiveThreads, req, expectRespDataToEqual([expectedThreadInfo]))
    })

    describe('after posting another mail on the same thread with some delay', () => {
      let startTimeForSecondPost
      beforeEach((done) => {
        setTimeout(() => {
          startTimeForSecondPost = new Date()
          onTest.post(
            makeReq({data: mailContents}), 
            res => { done() },
            err => {throw err})
        }, 10)
      })

      it('the new message should extend the mail thread', () => {
        const checkRes = res => {
          expect(res.data).toHaveLength(2)
        }
        shouldRunSuccessfully(onTest.getMailThread, makeReq({data: mailThreadId}), checkRes)
      })

      it('should update the last activity time on the thread', () => {
        const checkRes = res => {
          expect(res.data).toHaveLength(1)
          expect(res.data[0].latestMessageSent).toBeTruthy()
          expect(res.data[0].latestMessageSent.getTime()).toBeGreaterThanOrEqual(startTimeForSecondPost.getTime())
        }
        shouldRunSuccessfully(onTest.getActiveThreads, makeReq({}), checkRes)
      })

      for (const orderIsAscending of [false, true]) {
        const description = orderIsAscending ? '' : 'reverse'
        it(`should be possible to read the contents of the thread in ${description} chronological order`, () => {
          const reqData = {...mailThreadId, sortField: 'sent', sortOrderAsc: orderIsAscending}
          const req = makeReq({data: reqData})
          const checkRes = res =>
            {
              expect(res.data).toHaveLength(2) // Returns both results
              if (orderIsAscending) {
                expectSentTimesAscending(res.data[0], res.data[1])
              } else {
                expectSentTimesAscending(res.data[1], res.data[0])
              }
            }
          shouldRunSuccessfully(onTest.getMailThread, req, checkRes)
        })
      }
    })
  })

  it('should be possible to post multiple mails on multiple threads', () => {
    const onTest = new MailsServer(dummyAuther, dummyPostServer)
    runAll(onTest.post, arrayCollect(reqsForThread, TEST_MAILS))
  })

  const threadAppearsAsUnread = threadId => res => 
    expectRespDataToEqual(
      expect.arrayContaining([expect.objectContaining({threadId, unread: true})]))
  const threadIsPresent = threadId => res => expectRespDataToEqual(expect.arrayContaining([threadId]))
      
  describe('after multiple mails have been posted on multiple threads', () => {
    const expectedMailThreads = TEST_MAILS
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
          const expectedThreadInfo = expect.objectContaining({threadId: thread.threadId})
          const checkRes = expectRespDataToEqual(expect.arrayContaining([expectedThreadInfo]))
          shouldRunSuccessfully(onTest.getActiveThreads, reqByPostAuthor, checkRes)
        })
      }

      it(`initially ${thread.userWithUnread.username} should have unread mails for thread ${thread.threadName}`, () => {
        const reqByUser = makeReqFromUser({}, thread.userWithUnread)
        shouldRunSuccessfully(onTest.getUnreadThreads, reqByUser, threadIsPresent(thread.threadId))
      })

      it(`initially ${thread.userWithUnread.username} should have unread mails for thread ${thread.threadName} according to getActiveThreads`, () => {
        const reqByUser = makeReqFromUser({}, thread.userWithUnread)
        shouldRunSuccessfully(onTest.getActiveThreads, reqByUser, threadAppearsAsUnread(thread.threadId))
      })
    }

    const threadToWorkWith = expectedMailThreads[0]
    const makeReqFromUserWithUnread = req => makeReqFromUser(req, threadToWorkWith.userWithUnread)
    const threadIdMatches = thrd => {
      return thrd.threadId.relatedToPostId === threadToWorkWith.threadId.relatedToPostId
        && thrd.threadId.threadAuthor === threadToWorkWith.threadId.threadAuthor
    }
    const getLatestWrittenForThread = () => {
      let lastThreadActivity
      onTest.getActiveThreads(
        makeReqFromUserWithUnread({}),
        res => {lastThreadActivity = res.data.find(threadIdMatches).latestMessageSent},
        err => {throw err}
      )
      return lastThreadActivity
    }
    it (`should be possible for ${threadToWorkWith.userWithUnread.username} to mark thread ${threadToWorkWith.threadName} as read`, () => {

      const reqByUser = makeReqFromUserWithUnread({data: {timestampReadUpTo: getLatestWrittenForThread(), ...threadToWorkWith.threadId}})
      shouldRunSuccessfully(onTest.postMarkAsRead, reqByUser)
    })

    describe(`after ${threadToWorkWith.userWithUnread.username} has read the thread`, () => {
      const userWhoStartsWithUnread = threadToWorkWith.userWithUnread
      beforeEach(() => {
        const reqByUser = makeReqFromUser({data: {timestampReadUpTo: getLatestWrittenForThread(), ...threadToWorkWith.threadId}}, userWhoStartsWithUnread)
        shouldRunSuccessfully(onTest.postMarkAsRead, reqByUser)
      })

      const threadsReqForUser = makeReqFromUser({}, userWhoStartsWithUnread)
      const threadIsNotPresent = res => expect(res.data).not.toEqual(expect.arrayContaining([threadToWorkWith.threadId]))
      it('should appear as read for them when querying for unread', () => {
        shouldRunSuccessfully(onTest.getUnreadThreads, threadsReqForUser, threadIsNotPresent)
      })

      const threadAppearsAsRead = res => expectRespDataToEqual(expect.arrayContaining(
        [expect.objectContaining({threadId: threadToWorkWith.threadId, unread: false})]
      ))
      it('should appear as read for them when querying for active', () => {
        shouldRunSuccessfully(onTest.getActiveThreads, threadsReqForUser, threadAppearsAsRead)
      })

      const sendNewMailOnThreadFromUser = user =>
        {
          const newMailData = {mailText: 'new mail', ...threadToWorkWith.threadId}
          const req = makeReqFromUser({data: newMailData}, user)
          shouldRunSuccessfully(onTest.post, req)
        }
      it('should switch back to unread according to getUnread if another mail occurs', () => {
        const userToSend = 
          userWhoStartsWithUnread.username === threadToWorkWith.postAuthor.username 
          ? threadToWorkWith.threadAuthor 
          : threadToWorkWith.postAuthor
        
        sendNewMailOnThreadFromUser(userToSend)
        const checkThreadIsUnread = res => {
          expect(res.data).toEqual(expect.arrayContaining([threadToWorkWith.threadId]))
        }
        shouldRunSuccessfully(onTest.getUnreadThreads, threadsReqForUser, checkThreadIsUnread)
      })

      it('should switch back to unread according to getActive if another mail occurs', () => {
        const userToSend = 
          userWhoStartsWithUnread.username === threadToWorkWith.postAuthor.username 
          ? threadToWorkWith.threadAuthor 
          : threadToWorkWith.postAuthor
        
        sendNewMailOnThreadFromUser(userToSend)
        const checkThreadIsUnread = res => {
          expect(res.data).toEqual(expect.arrayContaining([threadToWorkWith.threadId]))
        }
        shouldRunSuccessfully(onTest.getUnreadThreads, threadsReqForUser, checkThreadIsUnread)
      })

      it('should not become unread according to getUnread if they mail again and no other mail occurs', () => {
        sendNewMailOnThreadFromUser(userWhoStartsWithUnread)
        shouldRunSuccessfully(onTest.getUnreadThreads, threadsReqForUser, threadIsNotPresent)
      })

      it('should not become unread according to getActive if they mail again and no other mail occurs', () => {
        sendNewMailOnThreadFromUser(userWhoStartsWithUnread)
        shouldRunSuccessfully(onTest.getActiveThreads, threadsReqForUser, threadAppearsAsRead)
      })
    })
  })
})