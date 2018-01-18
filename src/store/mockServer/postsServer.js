import { isValidPostType, HELP_WANTED } from './postTypes'
import { HELP_OFFERED } from '../../loggedIn/homePage/postTypes'

function makeFilterComponent (filterList, prevFilter, filterApplication) {
  if (filterList) {
    return post => prevFilter(post) && filterApplication(filterList, post)
  }
  return prevFilter
}

function intersectsWith (list1, list2) {
  return list1.some(elem1 => list2.includes(elem1))
}

function makeLocationFilterComponent (reqData) {
  if (reqData.filterOutRemoteLocations) {
    return (locations, post) => intersectsWith(locations, post.locations)
  } else {
    return (locations, post) => post.remote || intersectsWith(locations, post.locations)
  }
}

function makeFilter (reqData) {
  let filter = post => true
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
    makeLocationFilterComponent(reqData))
  return filter
}

function filterObj (obj, valueFilter) {
  const res = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key]
      if (valueFilter(element)) {
        res[key] = element
      }
    }
  }
  return res
}

function filterObjWithKeys (obj, valueFilter, keys) {
  const res = {}
  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key]
      if (valueFilter(element)) {
        res[key] = element
      }
    }
  }
  return res
}

export function PostsServer (userAuth) {
  const posts = {}
  let newPostId = 0

  const srv = {
    get (reqData, resolve, reject) {
      console.log('GET posts with request: ', reqData)
      // console.log(reqData)
      if (!reqData.authToken || !userAuth.syncGetUserCanSeeFullPosts(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
      } else {
        const criteriaFilter = makeFilter(reqData)
        const result =
          reqData.postIdsFilter
          ? filterObjWithKeys(posts, criteriaFilter, reqData.postIdsFilter)
          : filterObj(posts, makeFilter(reqData))
        resolve({data: result})
      }
    },
    getSingle (reqData, resolve, reject) {
      console.log('GET single post with request:')
      console.log(reqData)
      if (!reqData.authToken || !userAuth.syncGetUserCanSeeFullPosts(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
      } else {
        if (!posts.hasOwnProperty(reqData.postId)) {
          reject(new Error('Unknown postID: ' + reqData.postId))
          return
        }
        const result = posts[reqData.postId]
        resolve({data: result})
      }
    },
    syncGetPostedBy (postId) {
      return posts[postId] ? posts[postId].postedBy : null
    },
    postWithoutAuth (posterId, reqData, resolve, reject) {
      // console.log('Post without req / posterId', posterId, reqData)
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Cannot post - empty data'))
        return
      }
      const data = reqData.data
      if (!isValidPostType(data.postType)) {
        reject(new Error(`The post data must contain a postType field containing one of ['${HELP_WANTED}', '${HELP_OFFERED}']`))
        return
      }
      let newPost = {...data, postedBy: posterId}
      if (newPost.hasOwnProperty('id')) {
        reject(new Error('Error: cannot post something that already has an ID - this is server-assigned'))
        return
      }
      const postId = newPostId++
      posts[postId] = newPost
      console.log('Posting post succeeded')
      resolve({data: {postId: postId}})
    },
    post (reqData, resolve, reject) {
      // console.log('Post req', reqData)
      if (!reqData.authToken || !userAuth.syncGetUserCanPost(reqData.authToken)) {
        console.log('Rejecting due to auth issue')
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      const users = userAuth.syncGetAuthUsers(reqData.authToken)
      if (users.length !== 1) {
        console.log('Rejecting due to token error')
        reject(new Error('Can\'t find the currently logged in user from the token supplied'))
        return
      }
      const posterId = users[0]
      srv.postWithoutAuth(posterId, reqData, resolve, reject)
    },
    put (reqData, resolve, reject) {
      console.log('PUT post request:')
      console.log(reqData)
      if (!reqData.hasOwnProperty('postId')) {
        reject(new Error('Error: you must supply postID when putting a post'))
        return
      }
      const postId = reqData.postId
      if (!reqData.authToken || !userAuth.syncGetUserCanUpdate(reqData.authToken, postId)) {
        reject(new Error('Error: you dont have permission to update postId: ' + postId))
        return
      }

      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Error: no data property on the request - cannot update post'))
        return
      }

      posts[postId] = {...reqData.data}
      console.log('Put data succeeded for post ' + postId)
      resolve()
    },
    delete (reqData, resolve, reject) {
      console.log('DELETE post request:')
      console.log(reqData)
      if (!reqData.hasOwnProperty('postId')) {
        reject(new Error('Error: you must supply postID when deleting a post'))
        return
      }
      const postId = reqData.postId
      if (!reqData.authToken || !userAuth.syncGetUserCanDelete(reqData.authToken, postId)) {
        reject(new Error('Error: you dont have permission to delete postId: ' + postId))
        return
      }

      delete posts[postId]
      console.log('delete succeeeded for post ' + postId)
      resolve()
    }

  }
  return srv
}
