import {PostsServer} from '@/store/mockServer/postsServer'
import {INITIAL_POSTS} from '@/store/mockServer/initialPosts'
import {runAll} from '@/store/mockServer/callbackTools'

const USER_ID = 0
const AUTH_TOKEN = Math.random()

const dummyAuther = {
  syncGetUserCanPost(token) {
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
  }
}

function makeReq(remainingReq) {
  return {authToken: AUTH_TOKEN, ...remainingReq}
}

const TEST_POST_DATA = INITIAL_POSTS[0]

function extractPostData(postsData) {
  const posts = []
  for (const key in postsData) {
    if (postsData.hasOwnProperty(key)) {
      posts.push(postsData[key]);
    }
  }
  return posts
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

function checkPostsEqualTo(expectedResults) {
  return res => expect(extractPostData(res.data)).toEqual(expectedResults)
} 

describe ('PostsServer', () => {
  const checkNoResults = res => expect(extractPostData(res.data)).toHaveLength(0)

  it('should accept post requests', () => {
    const onTest = new PostsServer(dummyAuther)
    console.log(onTest)
    
    shouldRunSuccessfully(onTest.post, makeReq({data: TEST_POST_DATA}))
  }),

  describe('after a post', () => {
    const postContents = INITIAL_POSTS[0]
    let onTest
    let postId
    beforeEach(() => {
      onTest = new PostsServer(dummyAuther)
      onTest.post(
        makeReq({data: postContents}), 
        res => {postId = res.data.postId}, 
        err => {throw err})
    })

    it('should be possible to put an edited version of the existing post', () => {
      const newPostContents = {locations: ['Some new location'], ...postContents}
      shouldRunSuccessfully(onTest.put, makeReq({data: newPostContents, postId: postId}))
    })
      
    describe('after putting an edited version of the post', () => {
      it('should give back the edited version on the next get', () => {
        const newPostContents = {...postContents, locations: ['Some new location']}
        shouldRunSuccessfully(onTest.put, makeReq({data: newPostContents, postId: postId}))
        shouldRunSuccessfully(
          onTest.getSingle,
          makeReq({postId: postId}),
          res => {expect(res.data).toEqual(newPostContents)})
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
      runAll(onTest.post, postsToPost.map(post => makeReq({data: post})))
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

    describe('should be possible to filter to a non-empty result using', () => {
      const expectedResult = TEST_POST_DATA
      const filtersAndFields = {
        'postIdsFilter' : [0], // NOTE: this is a bit rubbish - have to assume we're going to get ID 0, should refactor
        'postedByFilter' : [expectedResult.postedBy],
        'interestsFilter' : [expectedResult.interests[0]],
        'skillsFilter' : [expectedResult.skills[0]],
        'locationsFilter': [expectedResult.locations[0]]
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