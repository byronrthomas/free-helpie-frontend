import { getServer } from './test.lib'
import { makeAuthdRequest, makeOtherUserAuthdRequest } from './commonReqs'
import { userRoutePrefix } from './commonRoutes'
import { getLastPostId, postLib } from './post.lib'
import { accountLib, getAccountData, getOtherAccountData } from './account.lib'
import { mailFix } from '../fixtures/mail.fix'

const mailsRoute = `/mails`
const activeThreadsRoute = '/activeMailThreads'
const unreadThreadsRoute = '/unreadMailThreads'

function getOtherUserId (state) {
  return getOtherAccountData(state).userId
}

export function getThreadInfo (state) {
  return {
    relatedToPostId: getLastPostId(state),
    threadAuthor: getOtherUserId(state)
  }
}

function makeMailCreateRequest (state, mailData) {
  return {
    ...makeOtherUserAuthdRequest(state),
    data: {
      ...mailData,
      ...getThreadInfo(state)
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

function create (state, mailData) {
  recordTimestamp(state)
  return getServer(state).post(
    mailsRoute,
    makeMailCreateRequest(state, mailData))
}

function makeMailThreadRequest (state) {
  return {
    ...makeOtherUserAuthdRequest(state),
    data: getThreadInfo(state)
  }
}

function getThread (state) {
  return getServer(state).get(
    mailsRoute,
    makeMailThreadRequest(state))
}

function getActiveForPostingUser (state) {
  return getServer(state).get(
    activeThreadsRoute,
    makeAuthdRequest(state)
  )
}

function getActiveForMailingUser (state) {
  return getServer(state).get(
    activeThreadsRoute,
    makeOtherUserAuthdRequest(state)
  )
}

function getUnreadForPostingUser (state) {
  return getServer(state).get(
    unreadThreadsRoute,
    makeAuthdRequest(state)
  )
}

function getUnreadForMailingUser (state) {
  return getServer(state).get(
    unreadThreadsRoute,
    makeOtherUserAuthdRequest(state)
  )
}

function ensurePostAndUsersReadyToMail (state) {
  return postLib.ensureAPostCreated(state)
    .then(() => accountLib.ensureAnotherUserCreated(state))
}

function setupPostAndUsersToMail (state) {
  beforeEach(() => {
    return ensurePostAndUsersReadyToMail(state)
  })
}

function setupOne (state) {
  beforeEach(() => {
    const mailData = mailFix.one()
    return ensurePostAndUsersReadyToMail(state)
      .then(() => create(state, mailData))
  })
}

export const mailLib = {
  create,
  getThread,
  setupOne,
  setupPostAndUsersToMail,
  getActiveForPostingUser,
  getActiveForMailingUser,
  getUnreadForPostingUser,
  getUnreadForMailingUser
}
