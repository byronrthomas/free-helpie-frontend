import { initServer } from '../lib/test.lib'
import { assertInviteFromUserPresent, assertInviteToUserPresent } from '../asserts/connectionInviteAsserts'
import { mailLib } from '../lib/mail.lib'
import { connectionInviteLib, firstInviter, secondInviter } from '../lib/connectionInvite.lib'

const INVITE_SENDER = firstInviter
const INVITE_RECEIVER = secondInviter

describe('Create connection invite', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    const inviteUsers = {
      from: INVITE_SENDER,
      to: INVITE_RECEIVER
    }
    mailLib.setupOne(state, inviteUsers)

    it('should report connection invite to invite recipient after connection invited', () => {
      return connectionInviteLib.sendInvite(state, inviteUsers)
        .then(() => connectionInviteLib.getInvitesToUser(state, INVITE_RECEIVER))
        .then(resp => assertInviteFromUserPresent(resp.data, state, INVITE_SENDER))
    })

    it('should report connection invite to invite sender after connection invited', () => {
      return connectionInviteLib.sendInvite(state, inviteUsers)
        .then(() => connectionInviteLib.getInvitesFromUser(state, INVITE_SENDER))
        .then(resp => assertInviteToUserPresent(resp.data, state, INVITE_RECEIVER))
    })
  })
})
