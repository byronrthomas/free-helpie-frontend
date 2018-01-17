import { getServer } from './test.lib'
import { loginToKnownAccount, getAccountData } from './account.lib'
import { makeAuthdRequest, makeEditRequest, makeEditRequestForUser } from './commonReqs'
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

function recordLastPostId (resp, state) {
  if (!resp.data || (typeof resp.data.postId !== 'number')) {
    throw new Error('No postId returned by server')
  }
  state.lastPostId = resp.data.postId
}

export function getLastPostId (state) {
  if (typeof state.lastPostId !== 'number') {
    throw new Error('No lastPostId recorded on state!')
  }
  return state.lastPostId
}

export function arrayContainingLastPostId (state) {
  const lastPostId = getLastPostId(state)
  return expect.arrayContaining([lastPostId])
}

function createPostFromUser (state, postData, userLabel) {
  recordTimestamp(state)
  return getServer(state).post(
    makeRoute(state),
    makeEditRequestForUser(state, postData, userLabel))
    .then(resp => recordLastPostId(resp, state))
}

function create (state, postData) {
  recordTimestamp(state)
  return getServer(state).post(
    makeRoute(state),
    makeEditRequest(state, postData))
    .then(resp => recordLastPostId(resp, state))
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

function ensureAPostCreated (state) {
  const postData = postFix.one()
  return loginToKnownAccount(state)
    .then(() => create(state, postData))
}

function setupOne (state) {
  beforeEach(() => {
    return ensureAPostCreated(state)
  })
}

function ensurePostFromUser (state, userLabel) {
  const postData = postFix.one()
  return createPostFromUser(state, postData, userLabel)
}

export const postLib = {
  create,
  ensurePostFromUser,
  edit,
  get,
  getCurrentUserPosts,
  setupOne,
  ensureAPostCreated
}
