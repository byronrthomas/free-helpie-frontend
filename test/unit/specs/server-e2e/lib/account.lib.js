import {getServer} from './test.lib'

// TODO: could actually make this be based on creating account properly
const LOGIN_DETAILS = {
  password: 'secret',
  username: 'test@test.com'
}

const OTHER_LOGIN_DETAILS = {
  password: 'js',
  username: 'js@js.com'
}

const ALL_KNOWN_USERS = [LOGIN_DETAILS, OTHER_LOGIN_DETAILS]

export function getAccountData (state) {
  if (!state.accountData) {
    console.log('state: ', state)
    throw new Error(`No account data in state`)
  }
  return state.accountData
}

export function getOtherAccountData (state) {
  if (!state.otherAccountData) {
    console.log('state: ', state)
    throw new Error(`No account data for other user in state`)
  }
  return state.otherAccountData
}

function makeAccountData (resp) {
  return {
    authToken: resp.authData,
    userId: resp.userId
  }
}

function saveAuthToState (resp, state) {
  state.accountData = makeAccountData(resp)
}

function saveOtherAuthToState (resp, state) {
  state.otherAccountData = makeAccountData(resp)
}

function saveLabelledAuthToState (resp, state, userLabel) {
  if (!state.loggedInUsers) {
    state.loggedInUsers = new Map()
  }
  state.loggedInUsers.set(userLabel, makeAccountData(resp))
}

export function getLabelledAccountData (state, userLabel) {
  if (!state.loggedInUsers || !state.loggedInUsers.has(userLabel)) {
    console.log('problem finding users, state is:', state)
    throw new Error(`Can't find any logged in users with label ${userLabel}`)
  }
  return state.loggedInUsers.get(userLabel)
}

export function loginToKnownAccount (state) {
  const server = getServer(state)
  return server.get('/accounts', LOGIN_DETAILS)
    .then(respData => saveAuthToState(respData, state))
}

function setupOneLoggedIn (state) {
  beforeEach(() => {
    return loginToKnownAccount(state)
  })
}

function ensureAnotherUserCreated (state) {
  const server = getServer(state)
  return server.get('/accounts', OTHER_LOGIN_DETAILS)
    .then(respData => saveOtherAuthToState(respData, state))
}

function handleLogin (state, userLabel, userDetails) {
  const server = getServer(state)
  return server.get('/accounts', userDetails)
    .then(respData => saveLabelledAuthToState(respData, state, userLabel))
}

function ensureUsersCreated (state, userLabels) {
  if (userLabels.length > ALL_KNOWN_USERS.length) {
    throw new Error(`Don't currently know enough logins to satsify this, you requested ${userLabels.length} logins`)
  }
  const allLoginPromises =
    userLabels.map(
      (v, i) => { return handleLogin(state, v, ALL_KNOWN_USERS[i]) })
  return Promise.all(allLoginPromises)
}

export const accountLib = {
  setupOneLoggedIn,
  ensureAnotherUserCreated,
  ensureUsersCreated
}
