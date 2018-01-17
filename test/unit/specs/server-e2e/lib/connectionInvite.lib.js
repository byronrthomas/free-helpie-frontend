import { getServer } from './test.lib'
import { makeAuthdRequestForUser, makeEditRequestForUser } from './commonReqs'
import { userRoutePrefixForUser } from './commonRoutes'
import { getLastPostId } from './post.lib'
import { mailLib } from './mail.lib'
import { getLabelledAccountData } from './account.lib'

export const firstInviter = 'FIRST_INVITER'
export const secondInviter = 'SECOND_INVITER'
const fromFirstToSecond = {
  from: firstInviter,
  to: secondInviter}

function invitesFromMeRoute (state, user) {
  return `${userRoutePrefixForUser(state, user)}/connectionInvitesFromMe`
}

function invitesToMeRoute (state, user) {
  return `${userRoutePrefixForUser(state, user)}/connectionInvitesToMe`
}

function sendInvite (state, betweenUsers) {
  const postId = getLastPostId(state)
  const invitedUserId = getLabelledAccountData(state, betweenUsers.to).userId
  const reqData = {invitedUserId, relatedToPostId: postId}
  return getServer(state).post(
    invitesFromMeRoute(state, betweenUsers.from),
    makeEditRequestForUser(state, reqData, betweenUsers.from)
  )
}

function cancelInvite (state, betweenUsers) {
  const posterId = getLabelledAccountData(state, betweenUsers.to).userId
  const routePrefix = invitesFromMeRoute(state, betweenUsers.from)
  const fullRoute = `${routePrefix}/${posterId}`
  return getServer(state).delete(
    fullRoute,
    makeAuthdRequestForUser(state, betweenUsers.from)
  )
}

function getInvitesToUser (state, user) {
  return getServer(state).get(
    invitesToMeRoute(state, user),
    makeAuthdRequestForUser(state, user))
}

function getInvitesFromUser (state, user) {
  return getServer(state).get(
    invitesFromMeRoute(state, user),
    makeAuthdRequestForUser(state, user))
}

function setupOne (state) {
  beforeEach(() => {
    return mailLib.ensureMailSent(state, fromFirstToSecond)
      .then(() => sendInvite(state, fromFirstToSecond))
  })
}

export const connectionInviteLib = {
  sendInvite,
  getInvitesToUser,
  getInvitesFromUser,
  setupOne,
  cancelInvite
}
