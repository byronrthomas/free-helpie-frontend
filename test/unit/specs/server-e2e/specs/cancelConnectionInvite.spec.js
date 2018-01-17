import { initServer } from '../lib/test.lib'
import { assertInviteFromUserNotPresent, assertInviteToUserNotPresent } from '../asserts/connectionInviteAsserts'
import { connectionInviteLib, firstInviter, secondInviter } from '../lib/connectionInvite.lib'

const INVITE_SENDER = firstInviter
const INVITE_RECEIVER = secondInviter

describe('Cancel connection invite', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    const inviteUsers = {
      from: INVITE_SENDER,
      to: INVITE_RECEIVER
    }
    connectionInviteLib.setupOne(state, inviteUsers)

    it('should not report connection invite to invite recipient after connection canceled', () => {
      return connectionInviteLib.cancelInvite(state, inviteUsers)
        .then(() => connectionInviteLib.getInvitesToUser(state, INVITE_RECEIVER))
        .then(resp => assertInviteFromUserNotPresent(resp.data, state, INVITE_SENDER))
    })

    it('should not report connection invite to invite sender after connection canceled', () => {
      return connectionInviteLib.cancelInvite(state, inviteUsers)
        .then(() => connectionInviteLib.getInvitesFromUser(state, INVITE_SENDER))
        .then(resp => assertInviteToUserNotPresent(resp.data, state, INVITE_RECEIVER))
    })
  })
})
