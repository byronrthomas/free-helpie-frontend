import { getAccountData, getLabelledAccountData } from './account.lib'

export function userRoutePrefix (state) {
  const acct = getAccountData(state)
  return `/users/${acct.userId}`
}

export function userRoutePrefixForUser (state, user) {
  const acct = getLabelledAccountData(state, user)
  return `/users/${acct.userId}`
}
