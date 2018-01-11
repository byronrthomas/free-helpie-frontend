import {getServer} from './test.lib'

// TODO: could actually make this be based on creating account properly
const LOGIN_DETAILS = {
  password: 'secret',
  username: 'test@test.com'
}

export function getAccountData (state) {
  if (!state.accountData) {
    console.log('state: ', state)
    throw new Error(`No account data in state`)
  }
  return state.accountData
}

function saveAuthToState (resp, state) {
  const accountData = {
    authToken: resp.authData, 
    userId: resp.userId
  }
  state.accountData = accountData
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

export const accountLib = {
  setupOneLoggedIn
}