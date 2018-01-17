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
  return invites.find(invite => invite.otherUser === userId)
}

function expectInviteWithUserId (invites, userId) {
  const result = findInviteWithUserId(invites, userId)
  if (!result) {
    console.log('invites received = ', invites)
    throw new Error(`Can't find any invites with user Id ${userId}`)
  }
  return result
}

function expectNoInviteWithUserId (invites, userId) {
  const result = findInviteWithUserId(invites, userId)
  expect(result).toBeFalsy()
}

export function assertInviteFromInviterPresent (actuals, state) {
  checkAll(actuals, state)
  const userId = getOtherAccountData(state).userId
  const matching = expectInviteWithUserId(actuals, userId)
  checkCommonValues(matching, state)
}

export function assertInviteToInviteePresent (actuals, state) {
  checkAll(actuals, state)
  const userId = getAccountData(state).userId
  const matching = expectInviteWithUserId(actuals, userId)
  checkCommonValues(matching, state)
}

export function assertInviteFromInviterNotPresent (actuals, state) {
  checkAll(actuals, state)
  const userId = getOtherAccountData(state).userId
  expectNoInviteWithUserId(actuals, userId)
}

export function assertInviteToInviteeNotPresent (actuals, state) {
  checkAll(actuals, state)
  const userId = getAccountData(state).userId
  expectNoInviteWithUserId(actuals, userId)
}
