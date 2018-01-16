import { initServer } from '../lib/test.lib'
import { assertMailThreadContents } from '../asserts/mailAsserts'
import { assertMatchingMailThread, assertMatchingMailThreadIsRead, assertMatchingMailThreadIsUnread } from '../asserts/mailThreadAsserts'
import { mailFix } from '../fixtures/mail.fix'
import { mailLib } from '../lib/mail.lib'

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
