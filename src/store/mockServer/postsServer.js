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
    makeLocationFilterComponent(reqData))
  return filter
}

export function PostsServer (userAuth) {
  const posts = []

  const srv = {
    get (reqData, resolve, reject) {
      // console.log('GET posts with request:')
      // console.log(reqData)
      if (!reqData.authToken || !userAuth.syncGetUserCanSeeFullPosts(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
      } else {
        const result = posts.filter(makeFilter(reqData))
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
    },
    postWithoutAuth (reqData, resolve, reject) {
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Cannot post - empty data'))
        return
      }
      let newPost = {...reqData.data}
      if (newPost.hasOwnProperty('id')) {
        reject(new Error('Error: cannot post something that already has an ID - this is server-assigned'))
        return
      }
      newPost.id = posts.length
      posts.push(newPost)
      console.log('Posting post succeeded')
      resolve()
    },
    post (reqData, resolve, reject) {
      // console.log('POST post with request:')
      // console.log(reqData)

      if (!reqData.authToken || !userAuth.syncGetUserCanPost(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      srv.postWithoutAuth(reqData, resolve, reject)
    }
  }
  return srv
}
