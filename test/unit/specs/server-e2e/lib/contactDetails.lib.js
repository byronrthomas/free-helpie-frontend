import { getServer } from './test.lib'
import { loginToKnownAccount } from './account.lib'
import { makeAuthdRequest, makeEditRequest, makeAuthdRequestForUser, makeEditRequestForUser } from './commonReqs'
import { userRoutePrefix, userRoutePrefixForUser } from './commonRoutes'
import { contactDetailsFix } from '../fixtures/contactDetails.fix'

function makeRoute (state) {
  return `${userRoutePrefix(state)}/contactDetails`
}

function makeRouteForUser (state, user) {
  return `${userRoutePrefixForUser(state, user)}/contactDetails`
}

function create (state, contactData) {
  return getServer(state).post(
    makeRoute(state),
    makeEditRequest(state, contactData))
}

function createForUser (state, contactData, user) {
  return getServer(state).post(
    makeRouteForUser(state, user),
    makeEditRequestForUser(state, contactData, user))
}

function edit (state, contactData) {
  return getServer(state).put(
    makeRoute(state),
    makeEditRequest(state, contactData))
}

function get (state) {
  return getServer(state).get(
    makeRoute(state),
    makeAuthdRequest(state))
}

function getOtherUser (state, users) {
  console.log(`getOtherUser: `, users)
  return getServer(state).get(
    makeRouteForUser(state, users.getDetailsOf),
    makeAuthdRequestForUser(state, users.from))
}

function setupOne (state) {
  beforeEach(() => {
    const contactData = contactDetailsFix.one()
    return loginToKnownAccount(state)
      .then(() => create(state, contactData))
  })
}

export const contactDetailsLib = {
  create,
  createForUser,
  edit,
  get,
  getOtherUser,
  setupOne
}
