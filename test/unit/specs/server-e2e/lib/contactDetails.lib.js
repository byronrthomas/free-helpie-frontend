import { getServer } from './test.lib'
import { loginToKnownAccount } from './account.lib'
import { makeAuthdRequest, makeEditRequest } from './commonReqs'
import { userRoutePrefix } from './commonRoutes'
import { contactDetailsFix } from '../fixtures/contactDetails.fix'

function makeRoute (state) {
  return `${userRoutePrefix(state)}/contactDetails`
}

function create (state, contactData) {
  return getServer(state).post(
    makeRoute(state),
    makeEditRequest(state, contactData))
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

function setupOne (state) {
  beforeEach(() => {
    const contactData = contactDetailsFix.one()
    return loginToKnownAccount(state)
      .then(() => create(state, contactData))
  })
}

export const contactDetailsLib = {
  create,
  edit,
  get,
  setupOne
}
