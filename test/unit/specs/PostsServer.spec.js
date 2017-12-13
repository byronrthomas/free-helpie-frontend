import {PostsServer} from '@/store/mockServer/postsServer'
import {INITIAL_POSTS} from '@/store/mockServer/initialPosts'
import {runAll} from '@/store/mockServer/callbackTools'

const USER_ID = 0
const AUTH_TOKEN = Math.random()

const dummyAuther = {
  syncGetUserCanPost(token) {
    if (typeof token !== 'undefined') {
      return true
    }
  },
  syncGetUserCanSeeFullPosts(token) {
    if (typeof token !== 'undefined') {
      return true
    }
  }
}

function makeReq(post) {
  return {authToken: AUTH_TOKEN, data: post}
}

const TEST_POST_DATA = INITIAL_POSTS[0]

function removeId(post) {
  let post2 = {...post}
  delete post2.id
  return post2
}

function shouldSucceed(method, data, checkResult) {
  const checker = checkResult || (x => true)
  let hasSucceeded = false
  method(
    data,
    res => { hasSucceeded = true; checker(res) },
    err => {throw err}
  )
  expect(hasSucceeded).toBeTruthy()
}

describe ('PostsServer', () => {
  it('should accept post requests', () => {
    const onTest = new PostsServer(dummyAuther)
    console.log(onTest)
    
    shouldSucceed(onTest.post, makeReq(TEST_POST_DATA))
  }),
  describe('after some posts', () => {
    const postsToPost = INITIAL_POSTS
    let onTest
    beforeEach(() => {
      onTest = new PostsServer(dummyAuther)
      runAll(onTest.post, postsToPost.map(makeReq))
    })

    it('should be possible to fetch them back with unfiltered get', () => {
      const checkEqual = res => expect(res.data.map(removeId)).toEqual(postsToPost)
      shouldSucceed(onTest.get, makeReq({}), checkEqual)
    })
  })
  

})