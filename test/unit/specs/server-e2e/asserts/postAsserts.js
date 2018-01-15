import { checkTimingsProperty } from './commonAsserts'
import { getAccountData } from '../lib/account.lib'

const expectedStructure = {
  postedBy: expect.any(Number),
  title: expect.any(String),
  interests: expect.any(Array),
  skills: expect.any(Array),
  locations: expect.any(Array),
  remote: expect.any(Boolean),
  description: expect.any(String),
  timings: expect.any(Object)
}

function checkProperties (post) {
  expect(post).toEqual(expect.objectContaining(expectedStructure))
  checkTimingsProperty(post.timings)
}

function checkValues (post, state) {
  expect(post.postedBy).toBe(getAccountData(state).userId)
}

function checkAll (postsById, state) {
  expect(postsById).not.toBeNull()
  expect(postsById).not.toBeUndefined()

  const allPosts = getMappedValues(postsById)
  for (const post of allPosts) {
    checkProperties(post)
    checkValues(post, state)
  }
}

function getMappedValues (mapObj) {
  const result = []
  for (const key in mapObj) {
    if (mapObj.hasOwnProperty(key)) {
      const elem = mapObj[key]
      result.push(elem)
    }
  }
  return result
}

export function assertMatchingPostReturned (expected, mapOfActuals, state) {
  console.log('Received from server: ', mapOfActuals)
  checkAll(mapOfActuals, state)
  const actualValues = getMappedValues(mapOfActuals)

  expect(actualValues).toEqual(
    expect.arrayContaining([expect.objectContaining(expected)]))
}
