import { initServer } from '../lib/test.lib'
import { assertInviteFromInviterPresent, assertInviteToInviteePresent } from '../asserts/connectionInviteAsserts'
import { mailLib } from '../lib/mail.lib'
import { connectionInviteLib } from '../lib/connectionInvite.lib'

describe('Create connection invite', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    mailLib.setupOne(state)

    it('should report connection invite to invite recipient after connection invited', () => {
      return connectionInviteLib.sendInvite(state)
        .then(() => connectionInviteLib.getInvitesToInvitee(state))
        .then(resp => assertInviteFromInviterPresent(resp.data, state))
    })

    it('should report connection invite to invite sender after connection invited', () => {
      return connectionInviteLib.sendInvite(state)
        .then(() => connectionInviteLib.getInvitesFromInviter(state))
        .then(resp => assertInviteToInviteePresent(resp.data, state))
    })
  })
})
