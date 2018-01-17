import { initServer } from '../lib/test.lib'
import { assertInviteFromInviterNotPresent, assertInviteToInviteeNotPresent } from '../asserts/connectionInviteAsserts'
import { connectionInviteLib, firstInviter, secondInviter } from '../lib/connectionInvite.lib'
import { contactDetailsLib } from '../lib/contactDetails.lib'
import { assertMatchingDetails } from '../asserts/contactDetailsAsserts';

function assertNoDetails (resp) {
  expect(resp.data).toBeFalsy()
}

const firstInviteUsers = {
  from: firstInviter,
  to: secondInviter
}

const secondInviteUsers = {
  from: secondInviter,
  to: firstInviter
}

describe('Showing contact details of connections', () => {
  const state = {}
  initServer(state)

  describe('Without a connection made, only one invite', () => {
    connectionInviteLib.setupOne(state, firstInviteUsers)

    it(`should not return invitee's contact details when inviter asks`, () => {
      contactDetailsLib.getOtherUser(state, {from: firstInviteUsers.from, getDetailsOf: firstInviteUsers.to})
        .then(assertNoDetails)
    })

    it(`should not return inviter's contact details when invitee asks`, () => {
      contactDetailsLib.getOtherUser(state, {from: firstInviteUsers.to, getDetailsOf: firstInviteUsers.from})
        .then(assertNoDetails)
    })
  })

  // describe('After the connection is made', () => {
  //   connectionInviteLib.setupOneConnection(state)

  //   it(`should return first inviter's contact details when second inviter asks`, () => {
  //     const expectedDetails = contactDetailsLib.getContactDetailsOf(firstInviter)

  //     contactDetailsLib.getOtherUser(state, {from: secondInviter, getDetailsOf: firstInviter})
  //       .then(resp => assertMatchingDetails(expectedDetails, resp.data))
  //   })

  //   it(`should return second inviter's contact details when first inviter asks`, () => {
  //     const expectedDetails = contactDetailsLib.getContactDetailsOf(secondInviter)

  //     contactDetailsLib.getOtherUser(state, {from: firstInviter, getDetailsOf: secondInviter})
  //       .then(resp => assertMatchingDetails(expectedDetails, resp.data))
  //   })

  //   it(`should stop returning these if the first inviter cancels their invite`, () => {
  //     connectionInviteLib.cancelInvite({from: firstInviter, to: secondInviter})
  //       .then(() => contactDetailsLib.getOtherUser(state, {from: secondInviter, getDetailsOf: firstInviter}))
  //       .then(resp => {assertNoDetails(resp); return contactDetailsLib.getOtherUser(state, {from: firstInviter, getDetailsOf: secondInviter})})
  //       .then(assertNoDetails)
  //   })
  //   it(`should stop returning these if the second inviter cancels their invite`, () => {
  //     connectionInviteLib.cancelInvite({from: secondInviter, to: firstInviter})
  //       .then(() => contactDetailsLib.getOtherUser(state, {from: secondInviter, getDetailsOf: firstInviter}))
  //       .then(resp => {assertNoDetails(resp); return contactDetailsLib.getOtherUser(state, {from: firstInviter, getDetailsOf: secondInviter})})
  //       .then(assertNoDetails)
  //   })
  // })
})