import { PostsServer } from '@/store/mockServer/postsServer'
import { INITIAL_POSTS } from '@/store/mockServer/initialPosts'
import { runAll } from '@/store/mockServer/callbackTools'
import { HELP_WANTED } from '@/store/mockServer/postTypes'

const AUTH_TOKENS =
  [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random()
  ]
console.log('AuthTokens: ', AUTH_TOKENS)

const dummyAuther = {
  syncGetUserCanPost (token) {
    return typeof token !== 'undefined'
  },
  syncGetUserCanSeeFullPosts (token) {
    return typeof token !== 'undefined'
  },
  syncGetUserCanUpdate (token) {
    return typeof token !== 'undefined'
  },
  syncGetUserCanDelete (token, postId) {
    return typeof token !== 'undefined'
  },
  syncGetAuthUsers (token) {
    const tokenId = AUTH_TOKENS.findIndex(x => x === token)
    return tokenId < 0 ? [] : [tokenId]
  }
}

function makeReq (remainingReq) {
  return {authToken: AUTH_TOKENS[0], ...remainingReq}
}

function getTokenForUserId (userId) {
  if (typeof userId !== 'number' || AUTH_TOKENS.length < (userId + 1)) {
    throw new Error(`Can't find any token for userId ${userId}`)
  }
  return AUTH_TOKENS[userId]
}

function makePostReq (postData) {
  const posterToken = getTokenForUserId(postData.data.postedBy)
  return {authToken: posterToken, ...postData}
}

const TEST_POST_DATA = INITIAL_POSTS[0]

function extractPostData (postsData) {
  const posts = []
  for (const key in postsData) {
    if (postsData.hasOwnProperty(key)) {
      posts.push(postsData[key])
    }
  }
  return posts
}

function shouldRunSuccessfully (method, data, checkResult) {
  const checker = checkResult || (x => true)
  let hasSucceeded = false
  method(
    data,
    res => { hasSucceeded = true; checker(res) },
    err => { throw err }
  )
  expect(hasSucceeded).toBeTruthy()
}

function shouldFailWithMessage (method, data, msg) {
  const resolve = jest.fn()
  const reject = jest.fn()
  method(data, resolve, reject)
  expect(resolve).not.toHaveBeenCalled()
  expect(reject.mock.calls).toHaveLength(1)
  expect(reject.mock.calls[0][0].message).toEqual(msg)
}

function checkPostsEqualTo (expectedResults) {
  return res => expect(extractPostData(res.data)).toEqual(expectedResults)
}

describe('PostsServer', () => {
  const checkNoResults = res => expect(extractPostData(res.data)).toHaveLength(0)

  it('should accept post requests', () => {
    const onTest = new PostsServer(dummyAuther)

    shouldRunSuccessfully(onTest.post, makePostReq({data: TEST_POST_DATA}))
  })

  it('should reject post requests that do not specify a post type', () => {
    const onTest = new PostsServer(dummyAuther)
    const BAD_POST_DATA = {...TEST_POST_DATA}
    delete BAD_POST_DATA.postType

    shouldFailWithMessage(onTest.post, makePostReq({data: BAD_POST_DATA}), `The post data must contain a postType field containing one of ['helpWanted', 'helpOffered']`)
  })

  describe('after a post', () => {
    const postContents = INITIAL_POSTS[0]
    let onTest
    let postId
    beforeEach(() => {
      onTest = new PostsServer(dummyAuther)
      onTest.post(
        makePostReq({data: postContents}),
        res => { postId = res.data.postId },
        err => { throw err })
    })

    it('should return that the post was posted by the correct user', () => {
      const result = onTest.syncGetPostedBy(postId)
      expect(result).toEqual(postContents.postedBy)
    })

    it('should be possible to put an edited version of the existing post', () => {
      const newPostContents = {locations: ['Some new location'], ...postContents}
      shouldRunSuccessfully(onTest.put, makePostReq({data: newPostContents, postId: postId}))
    })

    describe('after putting an edited version of the post', () => {
      it('should give back the edited version on the next get', () => {
        const newPostContents = {...postContents, locations: ['Some new location']}
        shouldRunSuccessfully(onTest.put, makePostReq({data: newPostContents, postId: postId}))
        shouldRunSuccessfully(
          onTest.getSingle,
          makeReq({postId: postId}),
          res => { expect(res.data).toEqual(newPostContents) })
      })
    })

    it('should be possible to delete the post', () => {
      shouldRunSuccessfully(onTest.delete, makeReq({postId: postId}))
    })

    describe('after deleting the post', () => {
      it('should not appear in unfiltered get', () => {
        shouldRunSuccessfully(onTest.delete, makeReq({postId: postId}))
        shouldRunSuccessfully(onTest.get, makeReq({}), checkNoResults)
      })
    })
  })
  describe('after some posts', () => {
    const postsToPost = INITIAL_POSTS
    let onTest
    beforeEach(() => {
      onTest = new PostsServer(dummyAuther)
      runAll(onTest.post, postsToPost.map(post => makePostReq({data: post})))
    })

    it('should be possible to fetch them back with unfiltered get', () => {
      shouldRunSuccessfully(onTest.get, makeReq({}), checkPostsEqualTo(postsToPost))
    })

    describe('should give no results if an empty list is supplied as ', () => {
      const filtersToCheck = ['postIdsFilter', 'postedByFilter', 'interestsFilter', 'skillsFilter']
      for (const filterField of filtersToCheck) {
        it(`the ${filterField} filter`, () => {
          const reqData = {}
          reqData[filterField] = []
          console.log('Checking filter field = ' + filterField)
          shouldRunSuccessfully(onTest.get, makeReq(reqData), checkNoResults)
        })
      }
    })

    it('should give no results if the location filter is an empty list and filters exclude remote locations', () => {
      const reqData = {locationsFilter: [], filterOutRemoteLocations: true}
      shouldRunSuccessfully(onTest.get, makeReq(reqData), checkNoResults)
    })

    it('should reject a request to filter by an invalid post-type', () => {
      const reqData = {postTypeFilter: 'someUnknownPostType'}
      const expectedMsg = `postTypeFilter contains invalid entries, only valid items are ['helpWanted', 'helpOffered']`
      shouldFailWithMessage(onTest.get, makeReq(reqData), expectedMsg)
    })

    describe('should be possible to filter to a non-empty result using', () => {
      const expectedResult = TEST_POST_DATA
      const filtersAndFields = {
        'postIdsFilter': [0], // NOTE: this is a bit rubbish - have to assume we're going to get ID 0, should refactor
        'postedByFilter': [expectedResult.postedBy],
        'interestsFilter': [expectedResult.interests[0]],
        'skillsFilter': [expectedResult.skills[0]],
        'locationsFilter': [expectedResult.locations[0]],
        'postTypeFilter': [HELP_WANTED]
      }
      const containsExpectedResult =
        res => expect(extractPostData(res.data))
          .toEqual(expect.arrayContaining([expectedResult]))
      for (const filterKey in filtersAndFields) {
        it(` the ${filterKey} filter`, () => {
          const reqData = {}
          reqData[filterKey] = filtersAndFields[filterKey]
          shouldRunSuccessfully(onTest.get, makeReq(reqData), containsExpectedResult)
        })
      }
    })

    it('should give only remote results if the location filter is an empty list but remote is not excluded', () => {
      const expectedResult = postsToPost.filter(post => post.remote)
      if (expectedResult.length === 0) {
        throw new Error("Can't run test without having something to filter to")
      }
      const reqData = {locationsFilter: []}
      shouldRunSuccessfully(onTest.get, makeReq(reqData), checkPostsEqualTo(expectedResult))
    })
  })
})
