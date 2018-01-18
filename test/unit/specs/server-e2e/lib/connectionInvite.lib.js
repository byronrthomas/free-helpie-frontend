import { getServer } from './test.lib'
import { makeAuthdRequestForUser, makeEditRequestForUser } from './commonReqs'
import { userRoutePrefixForUser } from './commonRoutes'
import { getLastPostId } from './post.lib'
import { mailLib } from './mail.lib'
import { getUserId } from './account.lib'
import { contactDetailsLib } from './contactDetails.lib'

export const firstInviter = 'FIRST_INVITER'
export const secondInviter = 'SECOND_INVITER'

function invitesFromMeRoute (state, user) {
  return `${userRoutePrefixForUser(state, user)}/connectionInvitesFromMe`
}

function invitesToMeRoute (state, user) {
  return `${userRoutePrefixForUser(state, user)}/connectionInvitesToMe`
}

function sendInvite (state, betweenUsers) {
  const postId = getLastPostId(state)
  const invitedUserId = getUserId(state, betweenUsers.to)
  const reqData = {invitedUserId, relatedToPostId: postId}
  return getServer(state).post(
    invitesFromMeRoute(state, betweenUsers.from),
    makeEditRequestForUser(state, reqData, betweenUsers.from)
  )
}

function cancelInvite (state, betweenUsers) {
  const posterId = getUserId(state, betweenUsers.to)
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

function postContactDetails (state, contactDetailsByUser) {
  const allPromises = []
  for (const userLabel in contactDetailsByUser) {
    if (contactDetailsByUser.hasOwnProperty(userLabel)) {
      const details = contactDetailsByUser[userLabel]
      allPromises.push(
        contactDetailsLib.createForUser(state, details, userLabel))
    }
  }
  return Promise.all(allPromises)
}

function ensurePreconditionsSetup (state, users, contactDetails) {
  return mailLib.ensureMailSent(state, users)
    .then(() => postContactDetails(state, contactDetails))
}

function setupOne (state, betweenUsers, contactDetails) {
  beforeEach(() => {
    return ensurePreconditionsSetup(state, betweenUsers, contactDetails)
      .then(() => sendInvite(state, betweenUsers))
  })
}

function sendInvites (state, invites) {
  return Promise.all(
    invites.map(invite => sendInvite(state, invite))
  )
}

function setupInvites (state, invites, contactDetails) {
  beforeEach(() => {
    return ensurePreconditionsSetup(state, invites[0], contactDetails)
      .then(() => sendInvites(state, invites))
  })
}

export const connectionInviteLib = {
  sendInvite,
  getInvitesToUser,
  getInvitesFromUser,
  setupOne,
  setupInvites,
  cancelInvite
}
