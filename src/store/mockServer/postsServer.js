import {INITIAL_POSTS} from './initialPosts'

function makeFilterComponent (filterList, prevFilter, filterApplication) {
  if (filterList && filterList.length > 0) {
    return post =>
      prevFilter(post) && filterApplication(filterList, post)
  }
  return prevFilter
}

function intersectsWith (list1, list2) {
  return list1.some(elem1 => list2.includes(elem1))
}

function makeFilter (reqData) {
  let filter = post => true
  filter = makeFilterComponent(
    reqData.postIdsFilter,
    filter,
    (postIds, post) => postIds.includes(post.id))
  filter = makeFilterComponent(
    reqData.postedByFilter,
    filter,
    (postedBys, post) => postedBys.includes(post.postedBy))
  filter = makeFilterComponent(
    reqData.interestsFilter,
    filter,
    (interests, post) => intersectsWith(interests, post.interests))
  filter = makeFilterComponent(
    reqData.skillsFilter,
    filter,
    (skills, post) => intersectsWith(skills, post.skills))
  filter = makeFilterComponent(
    reqData.locationsFilter,
    filter,
    (locations, post) => { return post.remote || intersectsWith(locations, post.locations) })
  return filter
}

export function PostsServer (userAuth) {
  const posts = Array.from(INITIAL_POSTS)

  return {
    get (reqData, resolve, reject) {
      console.log('GET posts with request:')
      console.log(reqData)
      if (!reqData.authToken || !userAuth.syncGetUserCanSeeFullPosts(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
      } else {
        console.log('Unfiltered results =')
        console.log(posts)
        const result = posts.filter(makeFilter(reqData))
        console.log('Filtered results = ')
        console.log(result)
        resolve({data: result})
      }
    },
    getSingle (reqData, resolve, reject) {
      console.log('GET single post with request:')
      console.log(reqData)
      if (!reqData.authToken || !userAuth.syncGetUserCanSeeFullPosts(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
      } else {
        const postId = parseInt(reqData.postId)
        const result = posts.filter(post => post.id === postId)
        console.log('filtered results = ')
        console.log(result)
        if (result.length === 1) {
          resolve({data: result[0]})
        } else {
          reject(new Error('Could not find single post with ID ' + postId))
        }
      }
    }
  }
}
