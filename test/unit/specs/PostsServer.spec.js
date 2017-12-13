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

function makeReq(remainingReq) {
  return {authToken: AUTH_TOKEN, ...remainingReq}
}

const TEST_POST_DATA = INITIAL_POSTS[0]

function removeId(post) {
  let post2 = {...post}
  delete post2.id
  return post2
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

function checkEqualTo(expectedResults) {
  return res => expect(res.data.map(removeId)).toEqual(expectedResults)
} 

describe ('PostsServer', () => {
  it('should accept post requests', () => {
    const onTest = new PostsServer(dummyAuther)
    console.log(onTest)
    
    shouldRunSuccessfully(onTest.post, makeReq({data: TEST_POST_DATA}))
  }),
  describe('after some posts', () => {
    const postsToPost = INITIAL_POSTS
    let onTest
    beforeEach(() => {
      onTest = new PostsServer(dummyAuther)
      runAll(onTest.post, postsToPost.map(post => makeReq({data: post})))
    })

    it('should be possible to fetch them back with unfiltered get', () => {
      shouldRunSuccessfully(onTest.get, makeReq({}), checkEqualTo(postsToPost))
    })

    const checkNoResults = res => expect(res.data).toHaveLength(0)
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
        res => expect(res.data.map(removeId))
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
      shouldRunSuccessfully(onTest.get, makeReq(reqData), checkEqualTo(expectedResult))
    })
  })
})