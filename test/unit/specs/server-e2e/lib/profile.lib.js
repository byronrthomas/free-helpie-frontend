import { getServer } from './test.lib'
import { getAccountData, loginToKnownAccount } from './account.lib'
import { profileFix } from '../fixtures/profile.fix'

function makeEditRequest (state, profileData) {
  const acct = getAccountData(state)
  return {
    authToken: acct.authToken,
    data: profileData
  }
}

function makeGetRequest (state) {
  const acct = getAccountData(state)
  return {
    authToken: acct.authToken
  }
}

function makeRoute (state) {
  const acct = getAccountData(state)
  return `/users/${acct.userId}/profile`
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
    makeGetRequest(state))
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
