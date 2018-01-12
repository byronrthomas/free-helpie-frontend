import { getAccountData } from './account.lib'

export function userRoutePrefix (state) {
  const acct = getAccountData(state)
  return `/users/${acct.userId}`
}
