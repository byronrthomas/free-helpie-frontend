import { getAccountData, getOtherAccountData } from './account.lib'

export function userRoutePrefix (state) {
  const acct = getAccountData(state)
  return `/users/${acct.userId}`
}

export function otherUserRoutePrefix (state) {
  const acct = getOtherAccountData(state)
  return `/users/${acct.userId}`
}
