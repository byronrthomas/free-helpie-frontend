import { getAccountData, getOtherAccountData } from './account.lib'

function reqForAcct (acct) {
  return {authToken: acct.authToken}
}

export function makeAuthdRequest (state) {
  return reqForAcct(getAccountData(state))
}

export function makeOtherUserAuthdRequest (state) {
  return reqForAcct(getOtherAccountData(state))
}

export function makeEditRequest (state, newData) {
  return {
    ...makeAuthdRequest(state),
    data: newData
  }
}
