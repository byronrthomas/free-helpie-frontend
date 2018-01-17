import { initServer } from '../lib/test.lib'
import { assertInviteFromInviterNotPresent, assertInviteToInviteeNotPresent } from '../asserts/connectionInviteAsserts'
import { connectionInviteLib } from '../lib/connectionInvite.lib'

describe('Cancel connection invite', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    connectionInviteLib.setupOne(state)

    it('should not report connection invite to invite recipient after connection canceled', () => {
      return connectionInviteLib.cancelInvite(state)
        .then(() => connectionInviteLib.getInvitesToInvitee(state))
        .then(resp => assertInviteFromInviterNotPresent(resp.data, state))
    })

    it('should not report connection invite to invite sender after connection canceled', () => {
      return connectionInviteLib.cancelInvite(state)
        .then(() => connectionInviteLib.getInvitesFromInviter(state))
        .then(resp => assertInviteToInviteeNotPresent(resp.data, state))
    })
  })
})
