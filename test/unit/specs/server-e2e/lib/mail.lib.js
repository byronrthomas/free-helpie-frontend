import { getServer } from './test.lib'
import { makeAuthdRequestForUser } from './commonReqs'
import { getLastPostId, postLib } from './post.lib'
import { accountLib, getUserId } from './account.lib'
import { mailFix } from '../fixtures/mail.fix'

const mailsRoute = `/mails`
const activeThreadsRoute = '/activeMailThreads'
const unreadThreadsRoute = '/unreadMailThreads'

export const MAIL_RECEIVER = 'UserWhoPosted'
export const MAIL_SENDER = 'UserWhoMails'

export function getThreadInfo (state, user) {
  return {
    relatedToPostId: getLastPostId(state),
    threadAuthor: getUserId(state, user)
  }
}

function makeMailCreateRequest (state, mailData, user) {
  return {
    ...makeAuthdRequestForUser(state, user),
    data: {
      ...mailData,
      ...getThreadInfo(state, user)
    }
  }
}

function recordTimestamp (state) {
  state.mailLib = {
    beforeMail: new Date()
  }
}

export function getTimeBeforeMail (state) {
  if (!state.mailLib || !state.mailLib.beforeMail) {
    throw new Error(`Setup issue: don't seem to have recorded any timestamp before mail`)
  }
  return state.mailLib.beforeMail
}

function create (state, mailData, user) {
  recordTimestamp(state)
  return getServer(state).post(
    mailsRoute,
    makeMailCreateRequest(state, mailData, user))
}

function mailContentRequest (state, requestingUser) {
  return {
    ...makeAuthdRequestForUser(state, requestingUser),
    data: getThreadInfo(state, MAIL_SENDER)
  }
}

function getMailContents (state, fromUser) {
  return getServer(state).get(
    mailsRoute,
    mailContentRequest(state, fromUser))
}

function getActiveThreadsForUser (state, user) {
  return getServer(state).get(
    activeThreadsRoute,
    makeAuthdRequestForUser(state, user)
  )
}

function getUnreadThreadsForUser (state, user) {
  return getServer(state).get(
    unreadThreadsRoute,
    makeAuthdRequestForUser(state, user)
  )
}

function ensurePostAndUsersReadyToMail (state, betweenUsers) {
  const bothUsers = [betweenUsers.from, betweenUsers.to]
  return accountLib.ensureUsersCreated(state, bothUsers)
    .then(() => postLib.ensurePostFromUser(state, betweenUsers.to))
}

function setupPostAndUsersToMail (state, betweenUsers) {
  beforeEach(() => {
    return ensurePostAndUsersReadyToMail(state, betweenUsers)
  })
}

function ensureMailSent (state, betweenUsers) {
  const mailData = mailFix.one()
  return ensurePostAndUsersReadyToMail(state, betweenUsers)
    .then(() => create(state, mailData, betweenUsers.from))
}

function setupOne (state, betweenUsers) {
  beforeEach(() => {
    return ensureMailSent(state, betweenUsers)
  })
}

export const mailLib = {
  create,
  getMailContents,
  setupOne,
  ensureMailSent,
  setupPostAndUsersToMail,
  getActiveThreadsForUser,
  getUnreadThreadsForUser
}
