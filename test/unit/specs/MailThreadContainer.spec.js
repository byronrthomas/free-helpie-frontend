import { mount } from 'vue-test-utils'

import MailThreadContainer from '@/loggedIn/homePage/shared/MailThreadContainer.vue'
import { fail } from 'assert';

function mailWithDate (sentDate) {
  return {
    id: 0,
    sent: sentDate}
}

const TEST_USERNAME = 'TestUser'
function makeOptions (mails) {
  return {
    propsData: {
      mailItems: mails,
      myAvatar: {altText: 'You'},
      otherAvatar: {altText: 'Them'},
      username: TEST_USERNAME}}
}

let nextDate = new Date(2014, 10, 10)
function makeAMailSentBy (user) {
  const nextTime = nextDate.getTime() + 1000
  nextDate = new Date()
  nextDate.setTime(nextTime)
  return {
    id: 1,
    replyToMailId: -1,
    sent: nextDate,
    sender: user
  }
}

const NO_MAILS = makeOptions([])

describe('Mail thread container', () => {
  it('should sort mail items in reverse sent order', () => {
    const inputMails = [
      new Date(2010, 1, 1, 11, 11, 5),
      new Date(2011, 1, 1, 11, 11, 5),
      new Date(2010, 1, 1, 11, 10, 5),
      new Date(2010, 2, 1, 11, 11, 5),
    ].map(mailWithDate)

    const expectedOrder = 
      [inputMails[1], inputMails[3], inputMails[0], inputMails[2]]

    const onTest = mount(MailThreadContainer, makeOptions(inputMails))
    expect(onTest.vm.sortedMailItems).toEqual(expectedOrder)
  })

  it('should return !sentByCurrentUser if the sender of the mail is not the current user', () => {
    const onTest = mount(MailThreadContainer, NO_MAILS)
    expect(onTest.vm.sentByCurrentUser({sender: 'SomebodyElse'})).toBeFalsy()
  })

  it('should return sentByCurrentUser if the sender of the mail is the current user', () => {
    const onTest = mount(MailThreadContainer, NO_MAILS)
    expect(onTest.vm.sentByCurrentUser({sender: onTest.vm.username})).toBeTruthy()
  })

  it('should return !waitingForReply when the mail thread is empty', () => {
    const onTest = mount(MailThreadContainer, NO_MAILS)
    expect(onTest.vm.waitingForReply).toBeFalsy()
  })

  it('should return waitingForReply when the mail thread is not empty and the current user mailed last', () => {
    const inputMails = [
      'UserA', TEST_USERNAME, 'UserB', 'UserA', TEST_USERNAME
    ].map(makeAMailSentBy)
    const onTest = mount(MailThreadContainer, makeOptions(inputMails))
    expect(onTest.vm.waitingForReply).toBeTruthy()
  })

  it('should return !waitingForReply when the mail thread is not empty and another user mailed last', () => {
    const inputMails = [
      'UserA', TEST_USERNAME, 'UserB', 'UserA', TEST_USERNAME, 'UserC'
    ].map(makeAMailSentBy)
    const onTest = mount(MailThreadContainer, makeOptions(inputMails))
    expect(onTest.vm.waitingForReply).toBeFalsy()
  })

  it('should emit postMail with the new mail text when the button is clicked', () => {
    fail()
  })

  it('should be rendered correctly when the mail thread is non-empty', () => {
    fail()
  })
})