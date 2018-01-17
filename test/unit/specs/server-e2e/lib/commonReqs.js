import { getAccountData, getOtherAccountData, getLabelledAccountData } from './account.lib'

function reqForAcct (acct) {
  return {authToken: acct.authToken}
}

export function makeAuthdRequest (state) {
  return reqForAcct(getAccountData(state))
}

export function makeOtherUserAuthdRequest (state) {
  return reqForAcct(getOtherAccountData(state))
}

export function makeAuthdRequestForUser (state, userLabel) {
  return reqForAcct(getLabelledAccountData(state, userLabel))
}

export function makeEditRequest (state, newData) {
  return {
    ...makeAuthdRequest(state),
    data: newData
  }
}

export function makeOtherUserEditRequest (state, newData) {
  return {
    ...makeOtherUserAuthdRequest(state),
    data: newData
  }
}

export function makeEditRequestForUser (state, newData, userLabel) {
  return {
    ...makeAuthdRequestForUser(state, userLabel),
    data: newData
  }
}
