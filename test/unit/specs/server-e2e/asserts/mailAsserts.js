import { getTimeBeforeMail } from '../lib/mail.lib'
import { getUserId } from '../lib/account.lib'

const expectedStructure = {
  sender: expect.any(Number),
  text: expect.any(String),
  sent: expect.any(Date)
}

function checkProperties (mail) {
  expect(mail).toEqual(expect.objectContaining(expectedStructure))
}

function expectTimeAfter (expectedAfter, actual) {
  expect(actual.getTime()).toBeGreaterThanOrEqual(expectedAfter.getTime())
}

function checkValues (mail, state, user) {
  expect(mail.sender).toBe(getUserId(state, user))
  const beforeMail = getTimeBeforeMail(state)
  expectTimeAfter(beforeMail, mail.sent)
}

function checkAll (mails, state, mailSender) {
  expect(mails).not.toBeNull()
  expect(mails).not.toBeUndefined()
  expect(mails).toHaveLength(1)

  for (const mail of mails) {
    checkProperties(mail)
    checkValues(mail, state, mailSender)
  }
}

export function assertMailThreadContents (expected, actuals, state, mailSender) {
  checkAll(actuals, state, mailSender)

  expect(actuals).toEqual(
    expect.arrayContaining([expect.objectContaining({text:
      expected.mailText})]))
}
