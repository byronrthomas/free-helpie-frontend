import { mount } from 'vue-test-utils'

import MailThreadContainer from '@/loggedIn/homePage/shared/MailThreadContainer.vue'
import { fail } from 'assert';

function mailWithDate (sentDate) {
  return {
    id: 0,
    sent: sentDate}
}

function makeOptionsForConnectCancel (connectCancel) {
  return {
    propsData: {
      mailItems: [],
      myAvatar: {altText: 'You'},
      otherAvatar: {altText: 'Them'},
      username: TEST_USERNAME,
      connectOrCancelAllowed: connectCancel}}
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

  it('should emit sendMail with the new mail text when the button is clicked', () => {
    const emailText = 'Email text'
    const onTest = mount(MailThreadContainer, NO_MAILS)
    onTest.setData({...onTest.vm.$data, newMailText: emailText})
    onTest.find('#submitButton').trigger('click')

    expect(onTest.emitted().sendMail).toBeTruthy()
    expect(onTest.emitted().sendMail.length).toBe(1)
    expect(onTest.emitted().sendMail[0]).toEqual([emailText])
  })

  it('should emit makeConnection when the button is clicked', () => {
    const onTest = mount(MailThreadContainer, makeOptionsForConnectCancel('connectAllowed'))
    onTest.find('#makeConnection').trigger('click')

    expect(onTest.emitted().makeConnection).toBeTruthy()
    expect(onTest.emitted().makeConnection.length).toBe(1)
    expect(onTest.emitted().makeConnection[0]).toEqual([])
  })

  it('should emit cancelConnection when the button is clicked', () => {
    const onTest = mount(MailThreadContainer, makeOptionsForConnectCancel('cancelAllowed'))
    onTest.find('#cancelConnection').trigger('click')

    expect(onTest.emitted().cancelConnection).toBeTruthy()
    expect(onTest.emitted().cancelConnection.length).toBe(1)
    expect(onTest.emitted().cancelConnection[0]).toEqual([])
  })

  const allowedText = allowed => allowed ? 'allowed' : 'not allowed'
  const aMail = mailWithDate(new Date(2017, 11, 22))
  for (const hasMessages of [false, true]) {
    const messagesText = hasMessages ? 'messages' : 'no messages'
    for (const connectOrCancelState of ['disabled', 'connectAllowed', 'cancelAllowed']) {
      it(`should be rendered correctly when there are ${messagesText} and the cancelConnect state is ${connectOrCancelState}`, () => {
        const msgs = hasMessages ? [{...aMail, sender: 'AnotherUser'}] : []
        const options = {
          propsData: {
            mailItems: msgs,
            myAvatar: {altText: 'You'},
            otherAvatar: {altText: 'Them'},
            username: TEST_USERNAME},
            connectOrCancelAllowed: connectOrCancelState}
        const onTest = mount(MailThreadContainer, options)
        expect(onTest.element).toMatchSnapshot()
      })
    }
  }
})