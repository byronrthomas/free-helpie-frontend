import { getServer } from './test.lib'
import { loginToKnownAccount } from './account.lib'
import { makeAuthdRequest, makeEditRequest } from './commonReqs'
import { userRoutePrefix } from './commonRoutes'
import { profileFix } from '../fixtures/profile.fix'

function makeRoute (state) {
  return `${userRoutePrefix(state)}/profile`
}

function create (state, profileData) {
  return getServer(state).post(
    makeRoute(state),
    makeEditRequest(state, profileData))
}

// TODO: make this put rather than post
function edit (state, profileData) {
  return getServer(state).post(
    makeRoute(state),
    makeEditRequest(state, profileData))
}

function get (state) {
  return getServer(state).get(
    makeRoute(state),
    makeAuthdRequest(state))
}

function setupOne (state) {
  beforeEach(() => {
    const profileData = profileFix.one()
    return loginToKnownAccount(state)
      .then(() => create(state, profileData))
  })
}

export const profileLib = {
  create,
  edit,
  get,
  setupOne
}
