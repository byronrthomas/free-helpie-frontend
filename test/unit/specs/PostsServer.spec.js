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
    
    shouldRunSuccessfully(onTest.post, makeReq(TEST_POST_DATA))
  }),
  describe('after some posts', () => {
    const postsToPost = INITIAL_POSTS
    let onTest
    beforeEach(() => {
      onTest = new PostsServer(dummyAuther)
      runAll(onTest.post, postsToPost.map(makeReq))
    })

    it('should be possible to fetch them back with unfiltered get', () => {
      shouldRunSuccessfully(onTest.get, makeReq({}), checkEqualTo(postsToPost))
    })

    const checkNoResults = res => expect(res.data).toHaveLength(0)
    it('should give no results if any of the non-location filters are empty lists', () => {
      const filtersToCheck = ['postIdsFilter', 'postedByFilter', 'interestsFilter', 'skillsFilter']
      for (const filterField of filtersToCheck) {
        const reqData = {}
        reqData[filterField] = []
        console.log('Checking filter field = ' + filterField)
        shouldRunSuccessfully(onTest.get, makeReq(reqData), checkNoResults)
      }
    })

    it('should give no results if the location filter is an empty list and filters exclude remote locations', () => {
      const reqData = {locationsFilter: [], filterOutRemoteLocations: true}
      shouldRunSuccessfully(onTest.get, makeReq(reqData), checkNoResults)
    })

    it('should be possible to filter to a non-empty result using any of the filter fields', () => {
      const expectedResult = TEST_POST_DATA
      const filtersAndFields = {
        'postIdsFilter' : [expectedResult.id],
        'postedByFilter' : [expectedResult.postedBy],
        'interestsFilter' : [expectedResult.interests[0]],
        'skillsFilter' : [expectedResult.skills[0]],
        'locationsFilter': [expectedResult.locations[0]]
      }
      const containsExpectedResult = 
        res => expect(res.data.map(removeId))
          .toEqual(expect.arrayContaining(expectedResult))
      for (const filterKey in filtersAndFields) {
        const reqData = {}
        reqData[filterKey] = filtersAndFields[filterKey]
        shouldRunSuccessfully(onTest.get, makeReq(reqData), containsExpectedResult)
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