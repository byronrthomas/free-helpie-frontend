import { mount } from 'vue-test-utils'

import MailThreadContainer from '@/loggedIn/homePage/shared/MailThreadContainer.vue'
import { fail } from 'assert';

const TEST_USER_ID = 555
function makeOptionsForConnectCancel (connectCancel) {
  return {
    propsData: {
      mailItems: [],
      myAvatar: {altText: 'You'},
      otherAvatar: {altText: 'Them'},
      userId: TEST_USER_ID,
      connectOrCancelAllowed: connectCancel}}
}

function makeOptions (mails) {
  return {
    propsData: {
      mailItems: mails,
      myAvatar: {altText: 'You'},
      otherAvatar: {altText: 'Them'},
      userId: TEST_USER_ID}}
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
  it('should return !sentByCurrentUser if the sender of the mail is not the current user', () => {
    const onTest = mount(MailThreadContainer, NO_MAILS)
    const anotherUser = TEST_USER_ID + 1
    expect(onTest.vm.sentByCurrentUser({sender: anotherUser})).toBeFalsy()
  })

  it('should return sentByCurrentUser if the sender of the mail is the current user', () => {
    const onTest = mount(MailThreadContainer, NO_MAILS)
    expect(onTest.vm.sentByCurrentUser({sender: onTest.vm.userId})).toBeTruthy()
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
  const aMail = makeAMailSentBy('AnotherUser')
  for (const hasMessages of [false, true]) {
    const messagesText = hasMessages ? 'messages' : 'no messages'
    for (const connectOrCancelState of ['disabled', 'connectAllowed', 'cancelAllowed']) {
      it(`should be rendered correctly when there are ${messagesText} and the cancelConnect state is ${connectOrCancelState}`, () => {
        const msgs = hasMessages ? [aMail] : []
        const options = {
          propsData: {
            mailItems: msgs,
            myAvatar: {altText: 'You'},
            otherAvatar: {altText: 'Them'},
            userId: TEST_USER_ID},
            connectOrCancelAllowed: connectOrCancelState}
        const onTest = mount(MailThreadContainer, options)
        expect(onTest.element).toMatchSnapshot()
      })
    }
  }
})