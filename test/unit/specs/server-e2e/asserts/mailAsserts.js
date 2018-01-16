import { getAccountData, getOtherAccountData } from '../lib/account.lib'
import { getTimeBeforeMail } from '../lib/mail.lib'

const expectedStructure = {
  sender: expect.any(Number),
  text: expect.any(String),
  sent: expect.any(Date)
}

function checkProperties (mail) {
  expect(mail).toEqual(expect.objectContaining(expectedStructure))
}

function expectTimeAfter(expectedAfter, actual) {
  expect(actual.getTime()).toBeGreaterThanOrEqual(expectedAfter.getTime())
}

function checkValues (mail, state) {
  expect(mail.sender).toBe(getOtherAccountData(state).userId)
  const beforeMail = getTimeBeforeMail(state)
  expectTimeAfter(beforeMail, mail.sent)
}

function checkAll (mails, state) {
  expect(mails).not.toBeNull()
  expect(mails).not.toBeUndefined()
  expect(mails).toHaveLength(1)

  for (const mail of mails) {
    checkProperties(mail)
    checkValues(mail, state)
  }
}

function getMappedValues (mapObj) {
  const result = []
  for (const key in mapObj) {
    if (mapObj.hasOwnProperty(key)) {
      const elem = mapObj[key]
      result.push(elem)
    }
  }
  return result
}

export function assertMailThreadContents (expected, actuals, state) {
  checkAll(actuals, state)

  expect(actuals).toEqual(
    expect.arrayContaining([expect.objectContaining({text:
      expected.mailText})]))
}
