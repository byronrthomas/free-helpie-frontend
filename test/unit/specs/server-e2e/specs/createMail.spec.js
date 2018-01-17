import { initServer } from '../lib/test.lib'
import { assertMailThreadContents } from '../asserts/mailAsserts'
import { assertMatchingMailThread, assertMatchingMailThreadIsRead, assertMatchingMailThreadIsUnread } from '../asserts/mailThreadAsserts'
import { mailFix } from '../fixtures/mail.fix'
import { mailLib, MAIL_SENDER, MAIL_RECEIVER, usersForEmail } from '../lib/mail.lib'

describe('Create mail', () => {
  const state = {}
  const usersForEmail = {
    from: MAIL_SENDER,
    to: MAIL_RECEIVER
  }
  initServer(state)

  describe('Normal behaviours', () => {
    mailLib.setupPostAndUsersToMail(state, usersForEmail)

    it('should be possible to create a mail and get it back in a mail thread', () => {
      const mailData = mailFix.one()
      return mailLib.create(state, mailData, MAIL_SENDER)
        .then(() => mailLib.getMailContents(state, MAIL_RECEIVER))
        .then(resp => assertMailThreadContents(mailData, resp.data, state, MAIL_SENDER))
    })
  })

  describe('thread reporting', () => {
    mailLib.setupOne(state, usersForEmail)

    it('should report thread as active for mail receiver after mail', () => {
      return mailLib.getActiveThreadsForUser(state, MAIL_RECEIVER)
        .then(resp => assertMatchingMailThread(resp.data, state, MAIL_SENDER))
    })

    it('should report thread as active for mail sender after mail', () => {
      return mailLib.getActiveThreadsForUser(state, MAIL_SENDER)
        .then(resp => assertMatchingMailThread(resp.data, state, MAIL_SENDER))
    })

    it('should report thread as unread for mail receiver after mail', () => {
      return mailLib.getActiveThreadsForUser(state, MAIL_RECEIVER)
        .then(resp => assertMatchingMailThreadIsUnread(resp.data, state, MAIL_SENDER))
    })

    it('should not report thread as unread for mail sender after mail', () => {
      return mailLib.getActiveThreadsForUser(state, MAIL_SENDER)
        .then(resp => assertMatchingMailThreadIsRead(resp.data, state, MAIL_SENDER))
    })
  })
})
