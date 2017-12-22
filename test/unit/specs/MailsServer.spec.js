import {MailsServer} from '@/store/mockServer/mailsServer'
import {INITIAL_MAILS} from '@/store/mockServer/initialMails'
import {runAll} from '@/store/mockServer/callbackTools'

const THREAD_AUTHOR_ID = {id: 0, username: 'UserRespondingToThePost'}
const AUTH_TOKEN = Math.random()

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
    console.log(token)
    console.log(AUTH_TOKEN)
    return token === AUTH_TOKEN ? [THREAD_AUTHOR_ID] : []
  },
  syncGetUserCanReadMails (token, postId, threadAuthor) {
    return typeof token !== 'undefined'
  }
}


function makeReq(remainingReq) {
  return {authToken: AUTH_TOKEN, ...remainingReq}
}

const TEST_POST_ID = 55
const TEST_POSTER = 'UserWhoPosted'
const TEST_MAIL_DATA = {
  threadAuthor: THREAD_AUTHOR_ID.username,
  postAuthor: TEST_POSTER,
  relatedToPostId: TEST_POST_ID,
  mailText: 'Hello, maybe I could help you, I live locally'
}

function findThreadForId (postId) {
  const res = INITIAL_MAILS.find(thread => thread.postId === postId)
  if (!res) {
    throw new Error("Cannot find any thread for postId " + postId)
  }
  return res
}

const dummyPostServer = {
  syncGetPostedBy(postId) {
    return postId === TEST_POST_ID ? TEST_POSTER : findThreadForId(postId).mails[0].sender
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

describe ('MailsServer', () => {
  const checkNoResults = res => expect(extractPostData(res.data)).toHaveLength(0)

  it('should accept post requests', () => {
    const onTest = new MailsServer(dummyAuther, dummyPostServer)
    
    shouldRunSuccessfully(onTest.post, makeReq({data: TEST_MAIL_DATA}))
  }),

  it('should refuse a post request where the user is not the postAuthor or the threadAuthor', () => {
    fail()
    // Again, I could just make it so that I don't trust & check I write it
  })

  describe('after a mail is posted', () => {
    const mailContents = TEST_MAIL_DATA
    let onTest
    let postDate
    beforeEach(() => {
      onTest = new MailsServer(dummyAuther, dummyPostServer)
      onTest.post(
        makeReq({data: mailContents}), 
        res => { postDate = new Date()},
        err => {throw err})
    })

    it('should have been persisted with an ID, a sent datetimestamp, and with logged in user recorded as the sender', () => {
      const reqData = {relatedToPostId: mailContents.relatedToPostId, threadAuthor: mailContents.threadAuthor}
      const checkRes = res => {
        expect(res.data).toBeTruthy()
        expect(res.data.length).toBe(1)
        expect(res.data[0]).toMatchObject({text: mailContents.mailText, sender: THREAD_AUTHOR_ID.username})
        expect(res.data[0].sent).toBeTruthy()
        expect(res.data[0].sent.getTime()).toBeGreaterThanOrEqual(postDate.getTime())
        expect(res.data[0].id).toBeGreaterThanOrEqual(0)
      }

      shouldRunSuccessfully(onTest.getMailThread, makeReq({data: reqData}), checkRes)
    })

    it('should be possible to post another mail on the same thread', () => {
      fail()
    })

    it('the thread should be returned by a query to fetch unread mails of the post author', () => {
      fail()
    })

    it('it should be possible to read the contents of the thread by getting it using thread author and post ID', () => {
      fail()
    })

    it('it should be possible to read the contents of the thread in a different sort order', () => {
      fail()
      // Look at what the rest of the world expects
    })

    describe('after posting another mail on the same thread', () => {
      it('should give back the new message on a subsequent get', () => {
        const newMailContents = {...mailContents, locations: ['Some new location']}
        shouldRunSuccessfully(onTest.put, makeReq({data: newMailContents, postId: postId}))
        shouldRunSuccessfully(
          onTest.getSingle,
          makeReq({postId: postId}),
          res => {expect(res.data).toEqual(newMailContents)})
      })
    })
  })
  describe('after some mails are posted on some threads', () => {
    const postsToPost = INITIAL_MAILS
    let onTest
    beforeEach(() => {
      onTest = new MailsServer(dummyAuther, dummyPostServer)
      runAll(onTest.post, postsToPost.map(post => makeReq({data: post})))
    })

    it('should be possible to find the threads as active for the post author', () => {
      fail()
    })

    it('should be possible to find the threads as active for the thread author', () => {
      fail()
    })

    it('should be possible for the post author to mark they have read the thread', () => {
      fail()
    })

    for (const subject of ['post author', 'thread author']) {
      describe(`after the ${subject} has read the thread`, () => {
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
    }

  })
})