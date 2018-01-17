import { getServer } from './test.lib'
import { makeAuthdRequest, makeOtherUserEditRequest, makeOtherUserAuthdRequest } from './commonReqs'
import { userRoutePrefix, otherUserRoutePrefix } from './commonRoutes'
import { getLastPostId } from './post.lib'
import { mailLib } from './mail.lib'
import { getAccountData } from './account.lib'

function makeFromPosterRoute (state) {
  return `${userRoutePrefix(state)}/connectionInvitesFromMe`
}

function makeFromMailerRoute (state) {
  return `${otherUserRoutePrefix(state)}/connectionInvitesFromMe`
}

function makeToPosterRoute (state) {
  return `${userRoutePrefix(state)}/connectionInvitesToMe`
}

function makeToMailerRoute (state) {
  return `${otherUserRoutePrefix(state)}/connectionInvitesToMe`
}

/// invite from poster to mailer
function sendInvite (state) {
  const postId = getLastPostId(state)
  const posterId = getAccountData(state).userId
  const reqData = {invitedUserId: posterId, relatedToPostId: postId}
  return getServer(state).post(
    makeFromMailerRoute(state),
    makeOtherUserEditRequest(state, reqData)
  )
}

function cancelInvite (state) {
  const posterId = getAccountData(state).userId
  const routePrefix = makeFromMailerRoute(state)
  const fullRoute = `${routePrefix}/${posterId}`
  return getServer(state).delete(
    fullRoute,
    makeOtherUserAuthdRequest(state)
  )
}

function getInvitesToInvitee (state) {
  return getServer(state).get(
    makeToPosterRoute(state),
    makeAuthdRequest(state))
}

function getInvitesFromInviter (state) {
  return getServer(state).get(
    makeFromMailerRoute(state),
    makeOtherUserAuthdRequest(state))
}

function setupOne (state) {
  beforeEach(() => {
    return mailLib.ensureMailSent(state)
      .then(() => sendInvite(state))
  })
}

export const connectionInviteLib = {
  sendInvite,
  getInvitesToInvitee,
  getInvitesFromInviter,
  setupOne,
  cancelInvite
}
