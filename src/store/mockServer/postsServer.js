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

function filterObj(obj, valueFilter) {
  const res = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      if (valueFilter(element)) {
        res[key] = element
      }
    }
  }
  return res
}

function filterObjWithKeys(obj, valueFilter, keys) {
  const res = {}
  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
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
      // console.log('GET posts with request:')
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
      posts[newPostId++] = newPost
      console.log('Posting post succeeded')
      resolve()
    },
    post (reqData, resolve, reject) {
      if (!reqData.authToken || !userAuth.syncGetUserCanPost(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      srv.postWithoutAuth(reqData, resolve, reject)
    },
    put (reqData, resolve, reject) {
      if (!reqData.hasOwnProperty(postId)) {
        reject(new Error("Error: you must supply postID when putting a post"))
        return
      }
      if (!reqData.authToken || !userAuth.syncGetUserCanUpdate(reqData.authToken, reqData.postId)) {
        reject(new Error('Error: you dont have permission to update postId: ' + postId))
        return
      }
      
      if (!reqData.hasOwnProperty('data')) {
        // Do the deletion
      }
      resolve()
    }

  }
  return srv
}
