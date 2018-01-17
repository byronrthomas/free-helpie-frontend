import { getOtherAccountData, getAccountData } from '../lib/account.lib'
import { getTimeBeforeMail } from '../lib/mail.lib'
import { getLastPostId } from '../lib/post.lib'

const expectedStructure = {
  otherUser: expect.any(Number),
  relatedToPostId: expect.any(Number),
  inviteSent: expect.any(Date)
}

function checkProperties (connectionInvite) {
  expect(connectionInvite).toEqual(expect.objectContaining(expectedStructure))
}

function expectTimeAfter (expectedAfter, actual) {
  expect(actual.getTime()).toBeGreaterThanOrEqual(expectedAfter.getTime())
}

function checkValues (connectionInvite, state) {
}

function checkAll (connectionInvites, state) {
  expect(connectionInvites).not.toBeNull()
  expect(connectionInvites).not.toBeUndefined()
  expect(connectionInvites.length).toBeGreaterThan(0)

  for (const connectionInvite of connectionInvites) {
    checkProperties(connectionInvite)
    checkValues(connectionInvite, state)
  }
}

function checkCommonValues (connectionInvite, state) {
  const beforeMail = getTimeBeforeMail(state)
  expectTimeAfter(beforeMail, connectionInvite.inviteSent)
  expect(connectionInvite.relatedToPostId).toBe(getLastPostId(state))
}

function findInviteWithUserId (invites, userId) {
  const result = invites.find(invite => invite.otherUser === userId)
  if (!result) {
    console.log('invites received = ', invites)
    throw new Error(`Can't find any invites with user Id ${userId}`)
  }
  return result
}

export function assertInviteFromInviterPresent (actuals, state) {
  checkAll(actuals, state)
  const userId = getOtherAccountData(state).userId
  const matching = findInviteWithUserId(actuals, userId)
  checkCommonValues(matching, state)
}

export function assertInviteToInviteePresent (actuals, state) {
  checkAll(actuals, state)
  const userId = getAccountData(state).userId
  const matching = findInviteWithUserId(actuals, userId)
  checkCommonValues(matching, state)
}
