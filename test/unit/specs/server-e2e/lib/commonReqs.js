import { getAccountData } from './account.lib'

export function makeAuthdRequest (state) {
  const acct = getAccountData(state)
  return {
    authToken: acct.authToken
  }
}

export function makeEditRequest (state, newData) {
  return {
    ...makeAuthdRequest(state),
    data: newData
  }
}
