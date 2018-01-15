import { getServer } from './test.lib'
import { makeAuthdRequest, makeEditRequest } from './commonReqs'
import { userRoutePrefix } from './commonRoutes'
import { getLastPostId, postLib } from './post.lib'

function makeRoute (state) {
  return `${userRoutePrefix(state)}/favourites`
}

function favouriteLatestPost (state) {
  const postId = getLastPostId(state)
  return getServer(state).post(
    makeRoute(state),
    makeEditRequest(state, [postId])
  )
}

function get (state) {
  return getServer(state).get(
    makeRoute(state),
    makeAuthdRequest(state))
}

function setupOne (state) {
  beforeEach(() => {
    return postLib.setupOne(state)
      .then(() => favouriteLatestPost(state))
  })
}

export const favouritesLib = {
  favouriteLatestPost,
  get,
  setupOne
}
