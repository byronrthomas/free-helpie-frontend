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

export const accountLib = {
  setupOneLoggedIn,
  ensureAnotherUserCreated
}
