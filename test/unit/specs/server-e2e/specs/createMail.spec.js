import { initServer } from '../lib/test.lib'
import { assertMailThreadContents } from '../asserts/mailAsserts'
import { mailFix } from '../fixtures/mail.fix'
import { accountLib } from '../lib/account.lib'
import { mailLib, getThreadInfo } from '../lib/mail.lib'

function arrayContainingLatestThreadId (state) {
  return expect.arrayContaining(
    [expect.objectContaining({
      threadId: getThreadInfo(state)})])
}

function findMatchingMailThread (data, state) {
  const threadInfo = getThreadInfo(state)
  const isMatching = thrd => {
    return thrd.threadId.threadAuthor === threadInfo.threadAuthor &&
      thrd.threadId.relatedToPostId === threadInfo.relatedToPostId
  }
  const matching = data.find(isMatching)
  if (!matching) {
    throw new Error(`Failed to find matching thread for threadInfo {author: ${threadInfo.threadAuthor}, post: ${threadInfo.relatedToPostId}}`)
  }
  return matching
}

function assertMatchingMailThread (data, state) {
  expect(data).toEqual(arrayContainingLatestThreadId(state))
}

function assertNoMatchingMailThread (data, state) {
  expect(data).not.toEqual(arrayContainingLatestThreadId(state))
}

function assertMatchingMailThreadIsRead (data, state) {
  const thread = findMatchingMailThread(data, state)
  expect(thread.unread).toBe(false)
}

function assertMatchingMailThreadIsUnread (data, state) {
  const thread = findMatchingMailThread(data, state)
  expect(thread.unread).toBe(true)
}

describe('Create mail', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    mailLib.setupPostAndUsersToMail(state)

    it('should be possible to create a mail and get it back in a mail thread', () => {
      const mailData = mailFix.one()
      return mailLib.create(state, mailData)
        .then(() => mailLib.getThread(state))
        .then(resp => assertMailThreadContents(mailData, resp.data, state))
    })
  })

  describe('thread reporting', () => {
    mailLib.setupOne(state)

    it('should report thread as active for posting user after mail', () => {
      return mailLib.getActiveForPostingUser(state)
        .then(resp => assertMatchingMailThread(resp.data, state))
    })

    it('should report thread as active for mailing user after mail', () => {
      return mailLib.getActiveForMailingUser(state)
        .then(resp => assertMatchingMailThread(resp.data, state))
    })

    it('should report thread as unread for posting user after mail', () => {
      return mailLib.getActiveForPostingUser(state)
        .then(resp => assertMatchingMailThreadIsUnread(resp.data, state))
    })

    it('should not report thread as unread for mailing user after mail', () => {
      return mailLib.getActiveForMailingUser(state)
        .then(resp => assertMatchingMailThreadIsRead(resp.data, state))
    })
  })
})
