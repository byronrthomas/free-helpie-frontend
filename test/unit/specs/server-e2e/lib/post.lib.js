import { getServer } from './test.lib'
import { loginToKnownAccount, getAccountData } from './account.lib'
import { makeAuthdRequest, makeEditRequest } from './commonReqs'
import { postFix } from '../fixtures/post.fix'

function makeRoute (state) {
  return `/posts`
}

function recordTimestamp (state) {
  state.lastPostEdit = new Date()
}

export function lastPostTimestamp (state) {
  return state.lastPostEdit
}

function create (state, postData) {
  recordTimestamp(state)
  return getServer(state).post(
    makeRoute(state),
    makeEditRequest(state, postData))
}

function edit (state, postData) {
  recordTimestamp(state)
  return getServer(state).put(
    makeRoute(state),
    makeEditRequest(state, postData))
}

function get (state) {
  return getServer(state).get(
    makeRoute(state),
    makeAuthdRequest(state))
}

function makeCurrentUserPostFilter (state) {
  return {postedByFilter: [getAccountData(state).userId]}
}

function getCurrentUserPosts (state) {
  const req = {
    ...makeAuthdRequest(state),
    ...makeCurrentUserPostFilter(state)
  }
  return getServer(state).get(
    makeRoute(state),
    req)
}

function setupOne (state) {
  beforeEach(() => {
    const postData = postFix.one()
    return loginToKnownAccount(state)
      .then(() => create(state, postData))
  })
}

export const postLib = {
  create,
  edit,
  get,
  getCurrentUserPosts,
  setupOne
}
